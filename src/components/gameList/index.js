import React, { Component } from 'react';
import close_icon from './assets/close.svg';

import './style.css';

export default class GameList extends Component {
	constructor(props){
		super(props);
		this.state = {
			gamelist: '',
			renderGame: [],
			user: '',
			loggedUserId: '',
		}
	}

	componentDidMount(){
		this.setGameList();
	}

	setGameList = () => {
		const { gamelist, renderGame, user, loggedUserId } = this.props;
		this.setState({ gamelist, renderGame, user, loggedUserId });		
	}

	showGameModal = (game) => {
		const { user, loggedUserId } = this.state;

		if(loggedUserId === user.id){
			this.props.showGameModal(game);	
		}
	}

	render(){

		const { gamelist, renderGame, user } = this.state;

		return(
			<div id="gamelist-modal">
				<div className="header">
					<h2>Lista de Jogos de <span>{user.name}</span></h2><img src={close_icon} alt=""  onClick={() => this.props.unmountMe()}/>	
				</div>
				
				<div className="gamelist-container">
					{ gamelist !== '' &&
						gamelist.map((game, index) => {

							if(!renderGame.includes(game.id)){
								return false;
							}

							return(
								<div className="game-item" key={index} onClick={() => this.showGameModal(game)}>
									<img src={game.image} alt={game.name} />
									<h6>{game.name}</h6>
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
}