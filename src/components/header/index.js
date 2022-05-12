import React, { Component } from 'react';
import api from '../../services/api';
import { Link, Redirect } from 'react-router-dom';
import token from '../../components/tokenFuncs';
import CardNotification from '../../components/cardNotification';
import Loading from '../../components/loading';
import Game from '../../components/gameModal';
import EditProfile from '../editProfile';

import logo from './assets/logo.svg';
import logo_responsive from './assets/logo-responsive.svg';
import arrow_profile from './assets/arrow-down.svg';
import edit_icon from './assets/edit.svg';
import logout_icon from './assets/logout.svg';

import './style.css';

export default class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			user: '',
			sub_nav: 'hidden',
			logout: false,
			editProfile: false,
			notify: {type: '', text: '', className: 'd-none' },

			searchType: 'user',
			searchResults: [],
			searchResultsLoading: false,
			search: '',
			mk_search_req: false,
			waitRequest: false,

			game: false,
		}
	}

	componentDidMount(){

		this.setHeaderInfo();
	}

	setHeaderInfo = () => {
		const user = token.getTokenDecoded();
		const searchType = localStorage.getItem('search-type-user-'+user.id);
		
		this.setState({ user, searchType:(searchType !== 'user' && searchType !== 'game')? 'user': searchType });
	}

	logOut = () => {
		const app_token = localStorage.getItem('app-token');
		api.defaults.headers.post['Authorization'] = app_token;

		this.setState({ logout: true });

		api.post('/logout')
		.then((res) => {
		})
		.catch((err) => {
		});
	}

	getSearchResult = (searchType, name) => {
		api.get(`/${searchType}?search=${name}`)
		.then((res) => {
			const data = res.data.response;
			this.setState({ searchResults: data, searchResultsLoading: false });
		})
		.catch((err) => {
			this.setState({ searchResults: undefined, searchResultsLoading: false });
		});
	}

	render(){
		const {
			user, sub_nav, logout, editProfile, searchType,searchResults,
			searchResultsLoading, search, notify, game
		} = this.state;

		if(logout){

			localStorage.removeItem('app-token');
			return <Redirect to={'/'} />
		}

		return(
			<header>
				<nav>
					<Link to={'/'}><img className="logo" src={logo} alt="Play With Me" /></Link>

					<div className="search-group" onClick={() => this.hideSubNav()}>
						<label htmlFor="search">Pesquisar</label>
						<input id="search" type="text" value={search} placeholder="Pesquisar" onChange={this.handleSearchChange} autoComplete="off" />
						<select title="Tipo de pesquisa" value={searchType} onChange={this.handleSearchTypeChange}>
							<option value="user">Jogador</option>
							<option value="game">Jogo</option>
						</select>

						{searchResults !== undefined && searchResults !== '' &&
							<div className="search-results">
								
								{
									searchResults.map((data, index) => {
										if(this.state.searchType === 'user'){
											return index < 5?
												<Link to={`/profile/${data.id}`} key={index} className="result-item" onClick={() => this.setState({searchResults: undefined, search: ''})}>
													<img src={data.image} alt={data.name} />
													<p>{data.name}</p>
												</Link>
											:false
										}else{
											return index < 5?
												<div key={index} className="result-item" onClick={() => this.showGameModal(data)}>
													
													<img src={data.image} alt={data.name} />
													<p>{data.name}</p>
												</div>
											:false
										}
									})
								}
								{searchResultsLoading &&
									<Loading />
								}
							</div>
						}

						{searchResults === undefined && search !== '' && !searchResultsLoading &&
							<div className="search-results">
								<div className="result-item blank">
									<p>Sem Resultados...</p>
								</div>
							</div>
						}

					</div>					

					<div className="nav-profile">
						<span>{user.uname}</span>
						<Link to={'/profile'}>
							<img className="img-profile" src={user.uimage} alt={user.uname} />
						</Link>
						<img className={'arrow-profile '+sub_nav} src={arrow_profile} alt="" onClick={this.showSubNav} />
						<div className={'sub-nav '+sub_nav}>
							<ul>
								<li className="sub-nav-img">
									<Link to={'/profile'}>
										<img src={user.uimage} alt={user.uname} />
									</Link>
								</li>
								<li onClick={this.editProfile}>Editar <img className="icon" src={edit_icon} alt="" /></li>
								<li onClick={this.logOut}>Sair <img className="icon" src={logout_icon} alt="" /></li>
							</ul>
						</div>
					</div>
					{editProfile &&
						<EditProfile unmountMe={this.handleEditProfileUnmount} setHeaderInfo={this.setHeaderInfo} />
					}
				</nav>

				<Link className="responsive-home" to={'/'}><img src={logo_responsive} alt="Play with me" /></Link>

				{notify.className === 'd-block' &&
					<div onClick={this.hideNotify}>
						<CardNotification
							className={notify.className}
							text={notify.text}
							type={notify.type}
						/>
					</div>
				}

				{game &&
					<Game game={this.state.game} unmountMe={this.handleGameModalUnmount} addedGame={this.handleAddedGame} from={'search'} />
				}
			</header>
		)
	}

	showGameModal = (data) => {
		this.setState({searchResults: undefined, search: '', game: data})
	}

	handleGameModalUnmount = (errorSuccess) => {
		this.setState({ game: false });

		if (errorSuccess === 'success') {
				this.setState({ notify: 
				{type: 'success', text: 'Jogo adicionado a sua lista.', className: 'd-block'}
			});
		}else if(errorSuccess === 'fail'){
			this.setState({ notify: 
				{type: 'error', text: 'Você já possui este jogo na lista.', className: 'd-block'}
			});
		}else if(errorSuccess === 'error'){
			this.setState({ notify: 
				{type: 'error', text: 'Houve um problema, a alteração não pôde ser salva.', className: 'd-block'}
			});
		}
	}

	handleAddedGame = (game) => {
		if(typeof this.props.updateGameList !== 'undefined'){
			this.props.updateGameList(game);
		}
	}

	handleSearchTypeChange = (e) => {
		const { user } = this.state;
		localStorage.setItem('search-type-user-'+user.id, e.target.value);
		const searchType = e.target.value;
		
		this.setState({ searchType });
	}

	handleSearchChange = (e) => {
		const name = e.target.value;
		if(!this.state.searchResultsLoading){
			this.setState({ search: name, searchResults: undefined, searchResultsLoading: true });	
		}
		this.setState({ search: name });

		if(name === ''){
			this.setState({ searchResults: undefined, searchResultsLoading: false });
			return false;
		}
		const { searchType } = this.state;
		
		// realiza a request
		clearTimeout(this.state.mk_search_req);
		// console.log('will make the req');
		this.setState({ mk_search_req: setTimeout(() => {
			// console.log('calling api');
			this.getSearchResult(searchType, name);
		}, 500) });

		// this.getSearchResult(searchType, name);
	}

	editProfile = () => {
		this.showSubNav();

		const { editProfile } = this.state;

		this.setState({ editProfile: editProfile === false? true : false });
	}

	handleEditProfileUnmount = (errorSuccess) => {
		this.setState({ editProfile: false });

		if (errorSuccess === 'success') {
			token.update(this.setHeaderInfo);
		
			if(typeof this.props.updateProfile !== 'undefined'){
				this.props.updateProfile();
			}
			
			this.setState({ notify: 
				{type: 'success', text: 'Perfil alterado com sucesso.', className: 'd-block'}
			});
		}else if(errorSuccess === 'error'){
			this.setState({ notify: 
				{type: 'error', text: 'Houve um problema, a alteração não pôde ser salva.', className: 'd-block'}
			});
		}
	}

	hideSubNav = () => {
		this.setState({ sub_nav: 'hidden' });
	}

	showSubNav = () => {
		const { sub_nav } = this.state;

		this.setState({ sub_nav: sub_nav === 'hidden'? 'show': 'hidden' });
	}

	hideNotify = () => {
		this.setState({ notify: { className: 'd-none' } });
	}
}