import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import CardNotification from '../../components/cardNotification';
import FullScreenLoading from '../../components/fullScreenLoading';
import Title from '../../components/documentTitle';

import './style.css';

const errors = {
	step1: false,
	email: true,
	Email: '',
	login: true,
	Login: '',
	password: true,
	Password: '',
	confPassword: true,
	ConfPassword: '',

	step2: false,
	file: true,
	File: '',
	name: true,
	Name: '',
	age: true,
	Age: '',

	step3: false,
};

export default class Register extends Component {

	constructor(props){
		super(props);
		this.state = {
			errors,
			fade: '',

			email: '',
			login: '',
			password: '',
			confPassword: '',

			name: '',
			age: '',
			info: '',
			file: '',
			filePreviewUrl: '',
			isPreview: 'd-none',

			discord: '',
			twitch: '',
			steam: '',
			origin: '',
			psn: '',
			xbox: '',

			step1: 'current',
			step2: null,
			step3: null,
			disablePreviousButton: true,
			disableNextButton: false,

			notify: {type: '', text: '', className: 'd-none' },
			loading: false,
		}
	}

	componentDidMount(){
		Title('Registro - PWM');
		
		this.componentIsMounted = true;
	}
	componentWillUnmount(){
		this.componentIsMounted = false;
	}

	register = (data) => {

		api.post('/user', data)
		.then((res) => {
			
			this.setState({ fade:'fade-out', loading: false });
			this.props.history.push('/register/verification');
		})
		.catch((error) => {
			error.response === undefined ? this.registerFailure(): this.registerFieldsFailure(error.response.data.response);

			// this.setState({ step3: 'current', disablePreviousButton: false, disableNextButton: false })
			
			this.setState({ step1: 'current', step2: null, step3: null, fade:'fade-out', loading:false, disableNextButton: false });
		});


	}
	base64encode = () => {
		const { 
			email, login, password, name, age,
			info, file, discord, twitch,
			steam, origin, psn, xbox
			} = this.state;

		
		const reader = new FileReader();
		reader.onloadend = () => {
			const image = reader.result;
			const data = {
				email, login, password, name, age,
				info, discord, twitch,
				steam, origin, psn, xbox, image
			}

			this.register(JSON.stringify(data));
		}
		reader.readAsDataURL(file);
	}

	registerFailure = () => {
		this.setState({ notify: 
			{type: 'error', text: 'Serviço indisponível, por favor aguarde alguns segundos e tente novamente.', className: 'd-block'}
		});
		this.cleanUp(7000);
	}
	registerFieldsFailure = (fields) => {
		const emailReg = new RegExp('mail');
		const loginReg = new RegExp('login');

		if(emailReg.test(fields) && loginReg.test(fields)){
			const { errors } = this.state;
			errors['Email'] = 'Email informado já em uso';
			errors['Login'] = 'Login informado já em uso';
			this.setState({ notify: 
				{type: 'error', text: 'O Email e Login informados já estão em uso.', className: 'd-block'},
				errors
			});
		}else if(emailReg.test(fields)){
			const { errors } = this.state;
			errors['Email'] = 'Email informado já em uso';
			this.setState({ notify: 
				{type: 'error', text: 'O Email informado já está em uso.', className: 'd-block'},
				errors
			});
		}else{
			const { errors } = this.state;
			errors['Login'] = 'Login informado já em uso';
			this.setState({ notify: 
				{type: 'error', text: 'O Login informado já está em uso.', className: 'd-block'},
				errors
			});
		}
		this.cleanUp(10000);	
	}
	cleanUp = (time) => {
		var cleanUp = setTimeout(() => {
			this.componentIsMounted ? this.setState({ notify: {className: 'd-none'} }): clearTimeout(cleanUp);
		}, time);
	}

	handleNextButton = () => {
		const { step1, step2, step3, errors} = this.state;
		//se step estiver ok
		//aplica checked em step e fade-in/fade-out


		if(errors.step1 && step1 !== 'checked'){
			this.setState({ fade: 'fade-in' });
			setTimeout(() => {
				this.setState({ step1: 'checked', step2: 'current', fade: 'fade-out', disablePreviousButton: false });
			}, 500);

		}else if(errors.step2 && step1 === 'checked' && step2 !== 'checked'){
			this.setState({ fade: 'fade-in' });
			setTimeout(() => {
				this.setState({ step2: 'checked', step3: 'current', fade: 'fade-out'});
			}, 500);

		}else if(errors.step1 && errors.step2 && step3 !== 'checked'){
			this.setState({ step3: 'checked', fade: 'fade-in', loading: true, disablePreviousButton: true, disableNextButton: true });
			
			/*aqui os 3 steps estão ok, então chama base64encode que codifica a img e manda para register()
			junto com o resto dos dados que estão prontos para irem pro BD*/
			this.base64encode();
			

		}else if(!errors.step1){
			this.setState({ step1: 'fail' });
		}else if(errors.step1 && !errors.step2){
			this.setState({ step2: 'fail' });
		}
	}

	handlePreviousButton = () => {
		const { step1, step2, step3} = this.state;
		
		if(step1 === 'checked' && step2 === 'checked' && (step3 === 'fail' || step3 === 'current')){
			this.setState({fade:'fade-in'});
			setTimeout(() => {
				this.setState({ step2: 'current', step3: null, fade: 'fade-out' });	
			},300);
			
		}else if(step1 === 'checked' && (step2 === 'fail' || step2 === 'current' )){
			this.setState({fade:'fade-in', disablePreviousButton: true });
			setTimeout(() => {
				this.setState({ step2: null, step1: 'current', fade: 'fade-out' });
			},300);
		}
	}
	
	//handle form 1
	handleEmailChange = (e) => {
		const email = e.target.value;
		this.setState({ email });
	}
	handleLoginChange = (e) => {
		const login = e.target.value;
		this.setState({ login });
	}
	handlePasswordChange = (e) => {
		const password = e.target.value;
		this.setState({ password });
	}
	handleConfPasswordChange = (e) => {
		const confPassword = e.target.value;
		this.setState({ confPassword });
	}
	handleEmailBlur = () => {
		const { email, errors } = this.state;

		if(email === ''){
			errors['email'] = true;
			errors['Email'] = 'Obrigatório';
			errors['step1'] = false;
		}else if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)){
			errors['email'] = true;
			errors['Email'] = 'Insira um email válido';
			errors['step1'] = false;
		}else{
			errors['email'] = false;
			errors['step1'] = !errors.email && !errors.login && !errors.password && !errors.confPassword? true:false;
		}

		this.setState({ errors });
	}
	handleLoginBlur = () => {
		const { login, errors } = this.state;

		if(login === ''){
			errors['login'] = true;
			errors['Login'] = 'Obrigatório';
			errors['step1'] = false;
		}else if(login.length < 6 ||login.length > 31 ){
			errors['login'] = true;
			errors['Login'] = 'Min. 6 Máx. 30 caracteres';
			errors['step1'] = false;
		}else{
			errors['login'] = false;
			errors['step1'] = !errors.email && !errors.login && !errors.password && !errors.confPassword? true:false;
		}

		this.setState({ errors });
	}
	handlePasswordBlur = () => {
		const { password, errors } = this.state;

		if(password === ''){
			errors['password'] = true;
			errors['Password'] = 'Obrigatório';
			errors['step1'] = false;
		}else if(password.length < 6 ||password.length > 31 ){
			errors['password'] = true;
			errors['Password'] = 'Min. 6 Máx. 30 caracteres';
			errors['step1'] = false;
		}else{
			errors['password'] = false;
			errors['step1'] = !errors.email && !errors.login && !errors.password && !errors.confPassword? true:false;
		}

		this.setState({ errors });
	}
	handleConfPasswordBlur = () => {
		const { password, confPassword, errors } = this.state;

		if(confPassword === ''){
			errors['confPassword'] = true;
			errors['ConfPassword'] = 'Obrigatório';
			errors['step1'] = false;
		}else if(password !== confPassword){
			errors['confPassword'] = true;
			errors['ConfPassword'] = 'Senhas não coincidem';
			errors['step1'] = false;
		}else{
			errors['confPassword'] = false;
			errors['step1'] = !errors.email && !errors.login && !errors.password && !errors.confPassword? true:false;
		}

		this.setState({ errors });
	}

	//handle form2
	handleFileChange = (e) => {
		const file = e.target.files[0];

		try {
			const filePreviewUrl = URL.createObjectURL(file);	
			this.setState({ file, filePreviewUrl, isPreview: 'd-block'});

			this.handleFileBlur(file);
		}
		catch (err){
			return false;
		}
	}
	handleNameChange = (e) => {
		const name = e.target.value;
		this.setState({ name });
	}
	handleAgeChange = (e) => {
		const age = e.target.value;
		this.setState({ age });
	}
	handleInfoChange = (e) => {
		const info = e.target.value;
		this.setState({ info });
	}
	handleFileBlur = (file) => {
		const { errors } = this.state;

		if(file === ''){
			errors['file'] = true;
			errors['File'] = 'Obrigatório';
			errors['step2'] = false;
		}else{
			errors['file'] = false;
			errors['step2'] = !errors.file && !errors.name && !errors.age? true:false;
		}

		this.setState({ errors });
	}
	handleNameBlur = () => {
		const { name, errors } = this.state;

		if(name === ''){
			errors['name'] = true;
			errors['Name'] = 'Obrigatório';
			errors['step2'] = false;
		}else if(name.length < 3 || name.length > 31){
			errors['name'] = true;
			errors['Name'] = 'Min. 3 Máx. 30 caracteres';
			errors['step2'] = false;
		}else{
			errors['name'] = false;
			errors['step2'] = !errors.file && !errors.name && !errors.age? true:false;
		}

		this.setState({ errors });
	}
	handleAgeBlur = () => {
		const { age, errors } = this.state;

		if(age === ''){
			errors['age'] = true;
			errors['Age'] = 'Precisamos de sua idade para definir a faixa etária dos usuários, outros usuários não teráo acesso a essa informação';
			errors['step2'] = false;
		}else if(!/^[0-9]+$/.test(age)){
			errors['age'] = true;
			errors['Age'] = 'Somente números';
			errors['step2'] = false;
		}else if(age < 5 || age > 99){
			errors['age'] = true;
			errors['Age'] = 'Não achamos que você tenha essa idade (o.O)';
			errors['step2'] = false;
		}else{
			errors['age'] = false;
			errors['step2'] = !errors.file && !errors.name && !errors.age? true:false;
		}

		this.setState({ errors });
	}

	//handle form3
	handleDiscordChange = (e) => {
		const discord = e.target.value;
		this.setState({ discord });
	}
	handleTwitchChange = (e) => {
		const twitch = e.target.value;
		this.setState({ twitch });
	}
	handleSteamChange = (e) => {
		const steam = e.target.value;
		this.setState({ steam });
	}
	handleOriginChange = (e) => {
		const origin = e.target.value;
		this.setState({ origin });
	}
	handlePsnChange = (e) => {
		const psn = e.target.value;
		this.setState({ psn });
	}
	handleXboxChange = (e) => {
		const xbox = e.target.value;
		this.setState({ xbox });
	}

	render() {
		const {
			fade,step1, step2, step3, disablePreviousButton,
			disableNextButton, loading, notify
		} = this.state;

		return(
			<main className="register-page fadeInComponent">
				
					<div className={"register-col "+fade}>
						
						{
							step1 === 'current' || step1 === 'fail'? this.CredentialForm1():
								step2 === 'current' || step2 === 'fail'?this.PerfilForm2():
									step3 === 'current' || step3 === 'fail'?this.PerfilForm3():false
						}

						{step3 !== 'checked' &&
						<div className="buttons">
							<button className="previous disabled" disabled={disablePreviousButton} onClick={this.handlePreviousButton}>&lArr; Voltar</button>	
							<button className="next" disabled={disableNextButton} onClick={this.handleNextButton} >Próximo &rArr;</button>							
						</div>
						}
						<div className="account-already">
							<p className="login-link">Já tem uma conta? <Link to="/login">Entrar</Link></p>
						</div>
					</div>
					
					<div className="step-col">
						<div className="step">
							<div className={'check '+step1} title="Credenciais">1</div>
							<div className={'check '+step2} title="Perfil parte 1">2</div>
							<div className={'check '+step3} title="Perfil parte 2">3</div>
						</div>
					</div>
				

				<CardNotification className={notify.className}
				text={notify.text}
				type={notify.type}
				/>

				{loading &&
					<FullScreenLoading text="Criando Registro. . ." />
				}
			</main>
		)
	}

	CredentialForm1 = () => {

		const { email, login, password, confPassword } = this.state;

		return(
			<div>	
				<div className="register-title">
					<p className="register-text">Defina as suas credenciais de acesso.</p>
				</div>
						
				<form className="register-form">
					<label htmlFor="email">E-mail *</label>
					<input id="email" value={email} className="input-field" onChange={this.handleEmailChange} onBlur={this.handleEmailBlur} type="text" placeholder="Meu_email@exemplo.com" />
					<span className="input-error">{errors.email && errors.Email}</span>
					<label htmlFor="login">Login *</label>
					<input id="login" value={login} className="input-field" onChange={this.handleLoginChange} onBlur={this.handleLoginBlur} type="text" placeholder="Login" />
					<span className="input-error">{errors.login && errors.Login}</span>

					<div className="form-group">
						<div>
							<label htmlFor="password">Senha *</label>
							<input id="password" value={password} className="input-field" onChange={this.handlePasswordChange} onBlur={this.handlePasswordBlur} type="password" placeholder="Senha" />
							<span className="input-error">{errors.password && errors.Password}</span>
						</div>
						<div>
							<label htmlFor="confirm-password">Confirmar Senha *</label>
							<input id="confirm-password" value={confPassword} className="input-field" onChange={this.handleConfPasswordChange} onBlur={this.handleConfPasswordBlur} type="password" placeholder="Confirme a Sua Senha" />
							<span className="input-error">{errors.confPassword && errors.ConfPassword}</span>
						</div>
					</div>
				</form>
							
				<div className="register-lead">
					<h4 className="text-lead">Há sempre alguem querendo jogar em equipe. <span role="img" alt="" aria-label="emoji" aria-labelledby="emoji">&#128515;</span></h4>
				</div>
			</div>
		)
	}

	PerfilForm2 = () => {

		const { isPreview, filePreviewUrl, name, age, info } = this.state;
		return(
			<div>
				<div className="register-title">
					<p className="register-text">Estamos quase lá. Eles precisam saber sobre você!</p>
				</div>

				<form className="register-form">
					<div className={"image-preview-container "+isPreview}>
						<img className={"image-preview "+isPreview} alt="profile" src={filePreviewUrl} />
					</div>
					
					<label htmlFor="image" className="input-field form-control input-file">
						Escolher Imagem de Perfil *
						<input id="image" value={''} className="select-file" onChange={this.handleFileChange} type="file" accept="image/jpg,image/png,image/jpeg" required="" />
					</label>
					<span className="input-error">{errors.file && errors.File}</span>

					<div className="form-group">
						<div>
							<label htmlFor="name">Nome *</label>
							<input id="name" value={name} className="input-field form-control" onChange={this.handleNameChange} onBlur={this.handleNameBlur} type="text" placeholder="Nome/NickName" />
							<span className="input-error">{errors.name && errors.Name}</span>
						</div>
						<div>
							<label htmlFor="age">Idade *</label>
							<input id="age" value={age} className="input-field form-control" onChange={this.handleAgeChange} onBlur={this.handleAgeBlur} type="text" placeholder="Sua Idade" />
							<span className="input-error">{errors.age && errors.Age}</span>
						</div>
					</div>

					<label htmlFor="info">Info (Opcional)</label>
					<textarea id="info" value={info} className="input-field form-control" onChange={this.handleInfoChange} placeholder="Sua Info" />
				</form>
			
			
				<div className="register-lead">
					<h4 className="text-lead">Não seja tóxico, ninguem gosta disso. <span role="img" alt="" aria-label="emoji" aria-labelledby="emoji">&#128512;</span></h4>
				</div>						
			</div>
		)
	}

	PerfilForm3 = () => {

		const { discord, twitch, steam, origin, psn, xbox } = this.state;

		return(
			<div>
				<div className="register-title">
					<p className="register-text">Qualquer usuário poderá visita-lo e/ou enviar convite nas seguintes plataformas:</p>
				</div>

				<form className="register-form form3">
					<div className="form-group">
						<div>
							<label htmlFor="discord">Discord (Opcional)</label>
							<input id="discord" value={discord} className="input-field form-control" onChange={this.handleDiscordChange} type="text" placeholder="seudiscord#000" />
						</div>
					
						<div>
							<label htmlFor="twitch">Twitch (Opcional)</label>
							<input id="twitch" value={twitch} className="input-field form-control" onChange={this.handleTwitchChange} type="text" placeholder="twitch.tv/você" />
						</div>
					</div>
				
					<div className="form-group">
						<div>
							<label htmlFor="steam">Steam (Opcional)</label>
							<input id="steam" value={steam} className="input-field form-control" onChange={this.handleSteamChange} type="text" placeholder="Seu Perfil/Link Steam" />
						</div>
						<div>
							<label htmlFor="origin">Origin (Opcional)</label>
							<input id="origin" value={origin} className="input-field form-control" onChange={this.handleOriginChange} type="text" placeholder="Seu Perfil/Link Origin" />
						</div>
					</div>

					<div className="form-group">
						<div>
							<label htmlFor="psn">PSN (Opcional)</label>
							<input id="psn" value={psn} className="input-field form-control" onChange={this.handlePsnChange} type="text" placeholder="Sua ID PSN" />
						</div>
						<div>
							<label htmlFor="xobx">Xbox Live (Opcional)</label>
							<input id="xbox" value={xbox} className="input-field form-control" onChange={this.handleXboxChange} type="text" placeholder="Sua Gamertag" />
						</div>
					</div>
				</form>
			

			<div className="col-12">
				<div className="register-lead">
					<h4 className="text-lead">interaja mais, ganhe mais. <span role="img" alt="" aria-label="emoji" aria-labelledby="emoji">&#128517;</span></h4>
				</div>
			</div>					
			</div>
		)
	}
}