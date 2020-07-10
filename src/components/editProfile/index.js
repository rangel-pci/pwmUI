import React, { Component } from 'react';
import api from '../../services/api';
import Loading from '../loading';
import token from  '../tokenFuncs';

import './style.css';

const errors = {
	name: false,
	info: false,
	discord: false,
	steam: false,
	origin: false,
	twitch: false,
	psn: false,
	xbox: false,

	ok: true,
}

export default class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			errors,
			user: {
				name: '',
				discord: '',
				steam: '',
				origin: '',
				twitch: '',
				psn: '',
				xbox: '',
				info: '',
			},
			file: '',
			loading: true,
		}
	}

	componentDidMount(){
		
		const loggedUserId = token.getTokenDecoded().uid;
		this.setState({ loggedUserId });

		this.getProfile(loggedUserId)
	}

	getProfile(userId){
		api.get(`/user/${userId}`)
		.then((res) => {

			this.setState({
				user: res.data.response,
				loading: false
			});

			this.checkFields();			
		})
		.catch((error) => {
			this.setState({
				user: undefined,
				loading: false
			});
		})
	}

	handleNameChange = (e) => {
		const { user } = this.state;

		user.name = e.target.value;
		this.setState({ user});

		this.checkFields();
	}

	handleDiscordChange = (e) => {
		const { user } = this.state;

		user.discord = e.target.value;
		this.setState({ user });

		this.checkFields();
	}

	handleSteamChange = (e) => {
		const { user } = this.state;

		user.steam = e.target.value;
		this.setState({ user });

		this.checkFields();
	}

	handleOriginChange = (e) => {
		const { user } = this.state;

		user.origin = e.target.value;
		this.setState({ user });

		this.checkFields();
	}

	handleTwitchChange = (e) => {
		const { user } = this.state;

		user.twitch = e.target.value;
		this.setState({ user });

		this.checkFields();
	}

	handlePsnChange = (e) => {
		const { user } = this.state;

		user.psn = e.target.value;
		this.setState({ user });

		this.checkFields();
	}

	handleXboxChange = (e) => {
		const { user } = this.state;

		user.xbox = e.target.value;
		this.setState({ user });

		this.checkFields();
	}

	handleInfoChange = (e) => {
		const { user } = this.state;

		user.info = e.target.value;
		this.setState({ user });

		this.checkFields();
	}

	handleFileChange = (e) => {
		const file = e.target.files[0];
		this.setState({ file });

		try {
			const filePreviewUrl = URL.createObjectURL(file);

			const { user } = this.state;
			user.image = filePreviewUrl;
			this.setState({ user });
		}
		catch (err){
			return false;
		}
	}

	base64encode = () => {
		const { user, file } = this.state;

		this.setState({ loading: true });

		const reader = new FileReader();

		if(file !== undefined && file !== ''){
			reader.onloadend = () => {
				const image = reader.result;
				
				user.image = image;

				this.sendEditedProfile(JSON.stringify(user));
			}
			reader.readAsDataURL(file);
		}else{
			user.image = user.image+',false';
			this.sendEditedProfile(JSON.stringify(user));
		}
	}

	close = (errorSuccess) => {
		this.props.unmountMe(errorSuccess);
	}
	
	sendEditedProfile = (data) => {
		const app_token = localStorage.getItem('app-token');
		api.defaults.headers.put['Authorization'] = app_token;

		api.put('/user', data)
		.then((res) => {

			this.setState({ loading: false });
			this.close('success');
		})
		.catch((err) => {
			this.close('error');
		});
	}

	render(){
		const { errors, user, loading } = this.state;

		return(
			<div id="edit-profile">
				<div className="wrap">
				{user !== undefined &&
					<form>
						<label htmlFor="image" className="img-profile-edit-wrap">
							Imagem
							<img className="img-profile-edit" src={user.image} alt={user.name} />
							<input id="image" value={''} onChange={this.handleFileChange} type="file" accept="image/jpg,image/png,image/jpeg" required="" />
						</label>

						<label>Nome<br/>
							<input type="text"
								className={(user.name.length > 2 && user.name.length < 31)? 'ok':'not-ok' }
								value={user.name} onChange={this.handleNameChange} required=""/>
						</label>						

						<div className="input-group">
							<label>Discord<br/>
								<input
								className={user.discord.length <= 65? 'ok':'not-ok' }
								type="text" value={user.discord} onChange={this.handleDiscordChange}/>
							</label>

							<label>Steam<br/>
								<input
								className={user.steam.length <= 65? 'ok':'not-ok' }
								type="text" value={user.steam} onChange={this.handleSteamChange}/>
							</label>
						</div>
						
						<div className="input-group">
							<label>Origin<br/>
								<input
								className={user.origin.length <= 65? 'ok':'not-ok' }
								type="text" value={user.origin} onChange={this.handleOriginChange}/>
							</label>
							<label>Twitch<br/>
								<input
								className={user.twitch.length <= 65? 'ok':'not-ok' }
								type="text" value={user.twitch} onChange={this.handleTwitchChange}/>
							</label>
						</div>

						<div className="input-group">
							<label>PSN<br/>
								<input
								className={user.psn.length <= 65? 'ok':'not-ok' }
								type="text" value={user.psn} onChange={this.handlePsnChange}/>
							</label>
							<label>Xbox<br/>
								<input
								className={user.xbox.length <= 65? 'ok':'not-ok' }
								type="text" value={user.xbox} onChange={this.handleXboxChange}/>
							</label>
						</div>

						<label>Info<br/>
							<textarea type="text"
								className={user.info.length < 300? 'ok':'not-ok' }
								value={user.info} onChange={this.handleInfoChange} required="" />
						</label>
					</form>
				}
				{loading === false && user === undefined &&
					<h2>Não foi possível estabelecer uma conexão com o servidor...</h2>
				}
				</div>
				{loading === false && user !== undefined &&
					<div className="buttons">
						<button className="close-form" onClick={this.close}>Fechar</button>

						{errors.ok &&
							<button className="save-form" onClick={this.base64encode}>Salvar</button>
						}
					</div>
				}

				{loading &&
					<Loading />
				}
			</div>
		)
	}


	checkFields() {
		const { user, errors } = this.state;

		if(user.name.length < 3 || user.name.length > 31){
			errors.name = true;
		}
		else{
			errors.name = false;	
		}
		if(user.info.length > 300){
			errors.info = true;
		}
		else{
			errors.info = false;	
		}

		if(user.discord.length > 65){
			errors.discord = true;
		}
		else{
			errors.discord = false;	
		}
		if(user.steam.length > 65){
			errors.steam = true;
		}
		else{
			errors.steam = false;	
		}
		if(user.origin.length > 65){
			errors.origin = true;
		}
		else{
			errors.origin = false;	
		}
		if(user.twitch.length > 65){
			errors.twitch = true;
		}
		else{
			errors.twitch = false;	
		}
		if(user.psn.length > 65){
			errors.psn = true;
		}
		else{
			errors.psn = false;	
		}
		if(user.xbox.length > 65){
			errors.xbox = true;
		}
		else{
			errors.xbox = false;	
		}

		if(
			errors.name === true ||
			errors.info === true ||
			errors.discord === true ||
			errors.steam === true ||
			errors.origin === true ||
			errors.twitch === true ||
			errors.psn === true ||
			errors.xbox === true
		){
			errors.ok = false;
		}else{
			errors.ok = true;
		}

		this.setState({ errors });
	}
}