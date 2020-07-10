import React, { Component } from 'react';
import api from '../../services/api';
import Loading from '../../components/loading';

import save_icon from './assets/save.svg';
import trash_icon from './assets/trash.svg';
import './style.css';



export default class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			game: {},
			loading: false,
			from: '',
		}
	}

	componentDidMount(){
		this.setState({ game: this.props.game, from: this.props.from });
	}

	addToGameList = () => {
		this.setState({ loading: true });
		const { game } = this.state;

		const app_token = localStorage.getItem('app-token');
		api.defaults.headers.post['Authorization'] = app_token;

		api.post(`/gamelist/${game.id}`)
		.then((res) => {
			
			this.setState({ loading: false });
			this.props.unmountMe('success');
		})
		.catch((err) => {
	
			if (err.response.data.status === '409') {
				this.setState({ loading: false });
				this.props.unmountMe('fail');	
			}else{
				this.setState({ loading: false });
				this.props.unmountMe('error');	
			}
			
		});
	}

	DeleteFromGameList = () => {
		this.setState({ loading: true });
		const { game } = this.state;

		const app_token = localStorage.getItem('app-token');
		api.defaults.headers.delete['Authorization'] = app_token;

		api.delete(`/gamelist/${game.id}`)
		.then((res) => {
			
			this.setState({ loading: false });
			this.props.unmountMe('success', game.id);
		})
		.catch((err) => {
			this.setState({ loading: false });
			this.props.unmountMe('error');			
		});
	}

	render(){
		const { game, loading, from } = this.state;

		return(
			<div id="game-modal" className="fadeInComponent">
				<img className="game-image" src={game.image} alt={game.name} />
				<p>{game.name}</p>

				<div>
					<button onClick={this.props.unmountMe}>
						Fechar
					</button>
					{from === 'search'?
						<button onClick={this.addToGameList} title="adicionar jogo">
							<img src={save_icon} alt="adicionar jogo" />
						</button>
						:
						<button onClick={this.DeleteFromGameList} title="excluir jogo">
							<img src={trash_icon} alt="excluir jogo" />
						</button>
					}

					{loading &&
						<Loading />
					}
				</div>
			</div>
		)
	}
}