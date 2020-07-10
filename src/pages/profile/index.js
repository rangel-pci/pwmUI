import React, { Component } from 'react';
import api from '../../services/api'
import token from '../../components/tokenFuncs';
import CardNotification from '../../components/cardNotification';
import GameList from '../../components/gameList';
import Loading from '../../components/loading';
import Game from '../../components/gameModal';
import Header from '../../components/header';
import Title from '../../components/documentTitle';

import interactions_icon from './assets/interactions.svg';
import like_icon from './assets/like.svg';
import dislike_icon from './assets/dislike.svg';

import copy from './copyFunc';
import './style.css';


export default class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
			user: '',
			displayInfo: {
				info: 'd-block',
				infoButton: 'selected',
				platforms: 'd-none',
				platformsButton: ''
			},

			loading: true,
			notify: '',
			gameModal: false,
			game: '',

			gameList: false,
			renderGame: [],
		}
		this.headerSubNav = React.createRef();
	}

	componentDidMount(){
		Title('Perfil - PWM');

		this.setState({ loading: true });

		this.setProfile();
	}

	componentDidUpdate(prevProps){
		if(prevProps !== this.props){

			this.setProfile();
		}
	}

	setProfile = () => {
		const loggedUserId = token.getTokenDecoded().uid;
		this.setState({ loggedUserId: loggedUserId.toString() });

		const { id } = this.props.match.params;
		const userId = id !== undefined ? id : loggedUserId;

		api.get(`/user/${userId}`)
		.then((res) => {
			console.log('res', res.data);
			const data = res.data.response;
			console.log('data', data);

			if(data.likes === undefined){
				const obj = {likes: {quantity: 0}};
				Object.assign(data, obj);
			}
			if(data.dislikes === undefined){
				const obj = {dislikes: {quantity: 0}};
				Object.assign(data, obj);
			}
			//seta likes ou dislikes para 0 caso a API não tenha retornado algum

			this.setState({ user: data });

			//caso tenha game list preenche renderGame
			if(data.game_list){
				var renderGame = [];
				data.game_list.map((game, index) => {
					return renderGame.push(game.id);
				});

				this.setState({ renderGame: renderGame, loading: false });
			}else{
				this.setState({ loading: false });
			}
		})
		.catch((error) => {
			console.log(error);
			this.setState({ loading: false });
		})
	}

	giveLike = () => {
		const { loggedUserId, user } = this.state;

		if (loggedUserId !== user.id) {
			const app_token = localStorage.getItem('app-token');
			api.defaults.headers.post['Authorization'] = app_token;

			api.post(`/like/${user.id}`)
			.then((res) => {

				user.likes.quantity += 1;
				this.setState({ notify: 
					{type: 'success', text: `Você aprovou ${user.name}.`, className: 'd-block'}
				});
			})
			.catch((err) => {

				if(err.response.data.status === '409'){

					this.removeLike();
				}
			})
		}else{
			this.setState({ notify: 
				{type: 'error', text: 'Ei! Sem trapaças xD.', className: 'd-block'}
			});
		}
	}

	removeLike = () => {
		const { loggedUserId, user } = this.state;

		const app_token = localStorage.getItem('app-token');
		api.defaults.headers.delete['Authorization'] = app_token;

		const data = JSON.stringify({liked_user: user.id, who_liked: loggedUserId});

		api.delete(`/like/${user.id}`, data)
		.then((res) => {
			
			user.likes.quantity -= 1;

			this.setState({ notify: 
				{type: 'success', text: `Aprovação de ${user.name} removida.`, className: 'd-block'}
			});
		})
		.catch((err) => {

			this.setState({ notify: 
				{type: 'error', text: 'Houve um problema, a alteração não pôde ser salva.', className: 'd-block'}
			});
		})
	}

	giveDislike = () => {
		const { loggedUserId, user } = this.state;

		if (loggedUserId !== user.id) {
			const app_token = localStorage.getItem('app-token');
			api.defaults.headers.post['Authorization'] = app_token;

			api.post(`/dislike/${user.id}`)
			.then((res) => {

				user.dislikes.quantity += 1;
				this.setState({ notify: 
					{type: 'success', text: `Você reprovou ${user.name}.`, className: 'd-block'}
				});
			})
			.catch((err) => {

				if(err.response.data.status === '409'){

					this.removeDislike();
				}
			})
		}else{
			this.setState({ notify: 
				{type: 'error', text: 'o_0', className: 'd-block'}
			});
		}
	}

	removeDislike = () => {
		const { loggedUserId, user } = this.state;

		const app_token = localStorage.getItem('app-token');
		api.defaults.headers.delete['Authorization'] = app_token;

		const data = JSON.stringify({disliked_user: user.id, who_disliked: loggedUserId});

		api.delete(`/dislike/${user.id}`, data)
		.then((res) => {
			
			user.dislikes.quantity -= 1;

			this.setState({ notify: 
				{type: 'success', text: `Reprovação de ${user.name} removida.`, className: 'd-block'}
			});
		})
		.catch((err) => {

			this.setState({ notify: 
				{type: 'error', text: 'Houve um problema, a alteração não pôde ser salva.', className: 'd-block'}
			});
		})
	}

	formatDate = (dateTime) => {
	    const dt = new Date(dateTime);

	    const month = (dt.getMonth()+1) < 10? '0'+(dt.getMonth()+1): (dt.getMonth()+1);
	    const year = dt.getFullYear();

	    const date = `${month}/${year}`;

	    return date
  	}
	
	displayInfo = () => {

		this.setState({
			displayInfo: {
				info: 'd-block',
				infoButton: 'selected',
				platforms: 'd-none',
				platformsButton: ''
			},
		});
	}

	displayPlatforms = () => {
		this.setState({
			displayInfo: {
				info: 'd-none',
				infoButton: '',
				platforms: 'd-grid',
				platformsButton: 'selected'
			},
		});
	}

	showGameModal = (game) => {
		const { loggedUserId, user } = this.state;

		if(loggedUserId === user.id){
			this.setState({gameModal: true, game: game})
		}
	}

	handleGameModalUnmount = (errorSuccess, id = false) => {
		if(id){
			var { renderGame } = this.state;

			var _index;

			renderGame.forEach((gameId, index) => {
				if(gameId === id){
					_index = index;
				}
			});

			renderGame.splice(_index, 1);
			this.setState({ renderGame: renderGame });
		}

		this.setState({ gameModal: false });

		if (errorSuccess === 'success') {
			this.setState({ notify: 
				{type: 'success', text: 'Jogo removido da sua lista.', className: 'd-block'}
			});					
		}else if(errorSuccess === 'error'){
			this.setState({ notify: 
				{type: 'error', text: 'Houve um problema, a alteração não pôde ser salva.', className: 'd-block'}
			});
		}
	}

	hideNotify = () => {
		this.setState({ notify: { className: 'd-none' } });
	}

	showGameList = () => {
		this.setState({ gameList: true });
	}

	hideGameList = () => {
		this.setState({ gameList: false });	
	}

	render(){

		const { loggedUserId, user, displayInfo, loading, notify, gameModal, gameList, renderGame } = this.state;

		return(
			<div id="profile-page-container">
				<Header ref={this.headerSubNav} updateProfile={this.setProfile} />

				<div onClick={() => this.headerSubNav.current.hideSubNav()}>
					{loading === false && user !== undefined &&

					<main className="profile-page fadeInComponent">
						
						<div className="profile-banner">
							{ user && user.game_list
								? <img src={user.game_list[0].image} alt={user.game_list[0].name} />
								: user && user.id === loggedUserId
								? <div className="blank-banner">
									Você terá um background qunado adicionar um jogo a sua lista de jogos...
								  </div>
								: <div className="blank-banner">
									Este usuário ainda não possui uma lista de jogos...
								  </div>
							}
						</div>

						<div className="profile">
							<img className="profile-image" src={user.image} alt={user.name} />
							<div className="profile-name">
								<h1>{user.name}</h1>
							</div>
							<div>
							</div>

							<div className="profile-state">
								<div className="profile-like-dislike">
									<div className="like" title="Aprovar usuário" onClick={this.giveLike}>
										<img src={like_icon} alt="" />&nbsp;
										<span>
											{user && user.likes ? user.likes.quantity : 0}
										</span>
									</div>
									<div className="dislike" title="Reprovar usuário" onClick={this.giveDislike}>
										<img src={dislike_icon} alt="" />&nbsp;
										<span>
											{user && user.dislikes ? user.dislikes.quantity : 0}
										</span>
									</div>
								</div>

								<div className="profile-since">
									<p>Registrado desde
										<br />
										{ this.formatDate(user.created) }
									</p>
								</div>
							</div>
							<div className={'profile-info '+displayInfo.info}>
								<p>{user.info}</p>
							</div>
							<div className={'platforms '+displayInfo.platforms}>
								<div className="platform-container">
									Discord
									<div>
										<input id="discord" title="Discord" className="platform" type="text" readOnly defaultValue={user.discord}></input><div onClick={copy.discord} className="copy" title="Copiar Discord"></div>
									</div>
								</div>
								<div className="platform-container">
									Twitch
									<div>
										<input id="twitch" title="Twitch" className="platform" type="text" readOnly defaultValue={user.twitch}></input><div onClick={copy.twitch} className="copy" title="Copiar Twitch"></div>
									</div>
								</div>
								<div className="platform-container">
									Steam
									<div>
										<input id="steam" title="Steam" className="platform" type="text" readOnly defaultValue={user.steam}></input><div onClick={copy.steam} className="copy" title="Copiar Steam"></div>
									</div>
								</div>
								<div className="platform-container">
									Origin
									<div>
										<input id="origin" title="Origin" className="platform" type="text" readOnly defaultValue={user.origin}></input><div onClick={copy.origin} className="copy" title="Copiar Origin"></div>
									</div>
								</div>
								<div className="platform-container">
									PSN
									<div>
										<input id="psn" title="PSN" className="platform" type="text" readOnly defaultValue={user.psn}></input><div onClick={copy.psn} className="copy" title="Copiar PSN"></div>
									</div>
								</div>
								<div className="platform-container">
									Xbox
									<div>
										<input id="xbox" title="Xbox" className="platform" type="text" readOnly defaultValue={user.xbox}></input><div onClick={copy.xbox} className="copy" title="Copiar Xbox"></div>
									</div>
								</div>
							</div>
							<div className="profile-interactions">
								<p title="Quantidade de aprovações e reprovações dadas e recebidas">
									{user.interactions}
									<br/> Interações <br/>
									<img src={interactions_icon} alt="Interações" />
								</p>

							</div>

							{ loggedUserId === user.id &&
								<div className="email">{token.getTokenDecoded().uemail}</div>
							}

						</div>

						<div className="buttons">
							<button onClick={this.displayInfo} className={displayInfo.infoButton}>Info</button>
							<button onClick={this.displayPlatforms} className={displayInfo.platformsButton}>Plataformas</button>
						</div>

						{ user && user.game_list &&
							<h2 className="gamelist-title">Lista de Jogos</h2>
						}

						<div className="gamelist">
							{ user && user.game_list &&
								user.game_list.map((game, index) => {

									if(!renderGame.includes(game.id)){
										return false;
									}
									
									return index <= 4?
										<div className="game-item" key={index} onClick={() => this.showGameModal(game)}>
											<div>
												<img src={game.image} alt={game.name} title={game.name} />
												<h2>{game.name}</h2>
											</div>
										</div>
									: false;
								})
							}

							{ user && user.game_list && renderGame.length > 5 &&
								<div className="game-item game-number" onClick={this.showGameList}>
									<div>
										<h2>
											+{renderGame.length - 5}
											<br />
											Jogos
										</h2>
									</div>
								</div>
							}
						</div>

					</main>
					}
					{loading === false && user === undefined &&
						<main>
							<h1 className="user-404">Este usuário não existe...</h1>
						</main>
					}
					{loading &&
						<Loading bgColor={'#f1f1f1'}/>
					}
				</div>

				{notify.className === 'd-block' &&
					<div onClick={this.hideNotify}>
						<CardNotification
							className={notify.className}
							text={notify.text}
							type={notify.type}
						/>
					</div>
				}

				{gameModal &&
					<Game game={this.state.game} unmountMe={this.handleGameModalUnmount} from={'profile'} />
				}

				{gameList &&
					<GameList renderGame={renderGame} loggedUserId={loggedUserId} user={user} gamelist={user.game_list} showGameModal={this.showGameModal} unmountMe={() => this.setState({ gameList: false })} />
				}
			</div>
		)
	}
}