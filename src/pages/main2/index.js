import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import token from '../../components/tokenFuncs';
import Header from '../../components/header';
import Title from '../../components/documentTitle';

import './style.css';

//elemento a ser renderizado até que a API entregue os dados
const waiting_blocks = []
	for(let i=0; i<5; i++){
		waiting_blocks.push(
		  	<div key={i}>
				<div className="waiting-block">.</div>
				<div className="waiting-block-name">.</div>
			</div>
		)
	}

export default class Main extends Component {
	constructor(props){
		super(props);
		this.state = {
			notify: '',
			games: {},
			
			gameLoading: true,
			userLoading: true,

			users_recommended: {},
			users_random: {},
		}
		this.header = React.createRef();
	}

	componentDidMount(){
		Title('PWM');

		const loggedUserId = token.getTokenDecoded().uid;
		this.setState({ loggedUserId: loggedUserId.toString() });

		this.getContent();
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}

	getContent = () => {
		this.getUsers();
		this.getGames();

		this.interval = setInterval(() => {
			this.getGames();
		}, 10000);
	}

	getUsers = () => {
		this.setState({ userLoading: true });

		const app_token = localStorage.getItem('app-token');
		api.defaults.headers.get['Authorization'] = app_token;

		api.get('/user')
		.then((res) => {

			this.setState({ users_recommended: res.data.response.users_recommended, users_random: res.data.response.users_random, userLoading: false });
			// console.log('users: ', res.data.response);
		})
		.catch((err) => {
			console.log(err.response);
		});
	}

	getGames = () => {
		api.get('/game')
		.then((res) => {
			
			this.setState({ games: res.data.response, gameLoading: false });
		})
		.catch((err) => {
			console.log(err.response);
		});
	}

	render() {
		const { loggedUserId, games, users_recommended, users_random, gameLoading, userLoading } = this.state;

		return(
			<div id="home-page-container">
				<Header ref={this.header} />

				<div className="fadeInComponent" onClick={() => this.header.current.hideSubNav()}>
					<main>
						<div className='main-text'>
							<h2 className='title'>Encontre novos <span className='text-highlight'>membros</span> para sua <span className='text-highlight'>equipe</span></h2>
							<p>Essa é uma aplicação com foco em jogadores de multiplayer,<br></br> encontre pessoas que jogam o mesmo que você.</p>
						</div>

						<div className='player-container game' style={{ justifyContent: 'center' }}>
							<div className='text'>
								<p>Recomendaremos usuários<br></br>com base na sua lista de jogos.</p>
							</div>
							
							{!gameLoading && //renderizado após receber os dados
								games.map((game, index) => {				

									return true?
									(
									<div className={index < 8 ?'game-block':'game-block hide-in-mobile'} key={index} title={game.name} onClick={() => this.header.current.showGameModal(game)}>
										<div className='game-image'>
											<img src={game.image} alt={game.name} />
										</div>
										<div className='title'>{game.name}</div>
									</div>
									):false
								})
							}
							{gameLoading &&
								<p style={{ flex: '1' }}>Carregando Jogos...</p>
							}
						</div>

						<div className='player-container recommended'>
							
							{!userLoading && users_recommended &&
							<div className='text'>
								<p>Estes usuários jogam os mesmos jogos que você.
									<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" fontSize="0.8em" aria-hidden="true" focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>
								</p>
							</div>
							}

							{!userLoading && users_recommended && //renderizado após receber os dados
								users_recommended.map((user, index) => {				
									return index < 5?
									(
										<div className='player-block recommended' key={index}>
											<div className='profile-image'>
											<Link to={'/profile/'+user.id}>
												<img src={user.image} alt={user.name} />
											</Link>
											</div>
											<div className='title'>{user.name}</div>
										</div>
									):false
								})
							}
							{!userLoading && !users_recommended &&
								<p style={{ flex: '1' }}>Alguns dos usuários que possuem os mesmos jogos que você, aparecerão aqui, adicione jogos a sua lista.</p>
							}
							{userLoading &&
								<p style={{ flex: '1' }}>Carregando Usuáios...</p>
							}

						</div>
						
						<p className='others'>Outros Usuários</p>
							
						<div className='player-container' style={{ justifyContent: 'center' }}>

							{!userLoading && users_random && //renderizado após receber os dados
								users_random.map((user, index) => {				
									return user.id !== loggedUserId ?
									(
										<div className='player-block' key={index}>
											<div className='profile-image'>
											<Link to={'/profile/'+user.id}>
												<img src={user.image} alt={user.name} />
											</Link>
											</div>
											<div className='title'>{user.name}</div>
										</div>
									):false
								})
							}

							{!userLoading && (!users_random || (users_random.length === 1 && users_random[0].id === loggedUserId)) &&
								<p style={{ flex: '1' }}>Usuários aparecerão aqui de forma aleatória.</p>
							}
							{userLoading &&
								<p style={{ flex: '1' }}>Carregando Usuáios...</p>
							}
							
						</div>

						{/* <div className='my-site'>
							<a href="https://rangelpereira.com" rel='noopener noreferrer' target='_blank'>RangelPereira.com</a>
						</div> */}
					</main>
				</div>
			</div>
		)
	}
}