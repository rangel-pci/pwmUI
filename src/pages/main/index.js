import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import token from '../../components/tokenFuncs';
import Header from '../../components/header';
import Title from '../../components/documentTitle';

import './style.css';

import reload_icon from './assets/reload.svg';

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
			loggedUserId: '',
			userLoading: true,
			gameLoading: true,

			users: undefined,
			games: undefined,
			reloadUser: false,
			reloadGame: false,

			notify: '',
			gameModal: false,
		}
		this.header = React.createRef();
	}

	componentDidMount(){
		Title('PWM');

		const loggedUserId = token.getTokenDecoded().uid;
		this.setState({ loggedUserId: loggedUserId.toString() });

		this.getContent();
	}

	getContent = () => {
		this.getUsers();
		this.getGames();
	}

	getUsers = () => {
		this.setState({ userLoading: true, reloadUser: false });

		api.get('/user')
		.then((res) => {

			this.setState({ users: res.data.response, userLoading: false });
			setTimeout(() => {
				this.setState({ reloadUser: true });
			}, 3000);
		})
		.catch((err) => {
			console.log(err.response);
		});
	}

	getGames = () => {
		this.setState({ gameLoading: true, reloadGame: false });

		api.get('/game')
		.then((res) => {
			
			this.setState({ games: res.data.response, gameLoading: false });
			setTimeout(() => {
				this.setState({ reloadGame: true });
			}, 3000);
		})
		.catch((err) => {
			console.log(err.response);
		});
	}

	render() {
		const { loggedUserId, userLoading, gameLoading, users, games, reloadGame, reloadUser } = this.state;

		return(
			<div id="home-page-container">
				<Header ref={this.header} />

				<div className="fadeInComponent" onClick={() => this.header.current.hideSubNav()}>
					<main>
						
						
						{userLoading && //renderizado enquanto espera os dados da API
							<div className="waiting">
								<div className="waiting-title">.</div>
								<div className="waiting-users">
									{waiting_blocks}
								</div>
							</div>
						}
						{!userLoading && //renderizado após receber os dados
							<div>
								<h2>Jogadores</h2>
								<div className="user-container">
									{	users.map((user, index) => {
											if(loggedUserId === user.id){
												return false;
											}

											return index < 7?
											(
												<Link key={index} to={`/profile/${user.id}`} className="user-item" title={user.name}>
													<img src={user.image} alt={user.name} />
													<h3>{user.name}</h3>
												</Link>
											)
											:false;
										})

									}
								</div>
							</div>
						}

						{reloadUser &&
							<div  className="reload" onClick={() => this.getUsers()}>
								<img src={reload_icon} alt="Atualizar" />
							</div>
						}

						<hr />

						{gameLoading && //renderizado enquanto espera os dados da API
							<div className="waiting">
								<div className="waiting-title">.</div>
								<div className="waiting-games">
									{waiting_blocks}
								</div>
							</div>
						}
						{!gameLoading && //renderizado após receber os dados
							<div>
								<h2>Jogos</h2>
								<div className="game-container">
									{	games.map((game, index) => {
											
											return index < 7?
											(
												<div key={index} className="game-item" title={game.name}
													onClick={() => this.header.current.showGameModal(game)}>
													
													<img src={game.image} alt={game.name} />
													<h3>{game.name}</h3>
												</div>
											)
											:false;
										})

									}
								</div>
							</div>
						}

						{reloadGame &&
							<div  className="reload" onClick={() => this.getGames()}>
								<img src={reload_icon} alt="Atualizar" />
							</div>
						}

					</main>
				</div>
			</div>
		)
	}
}