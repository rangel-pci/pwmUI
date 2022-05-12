import React, { Component } from 'react';
import api from '../../services/api'
import { Link } from 'react-router-dom';
import FullScreenLoading from '../../components/fullScreenLoading';
import Title from '../../components/documentTitle';

import './style.css';


export default class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			login: '',
			password: '',
			authValidation: null,
			loading: false,
		}
	}

	componentDidMount(){
		Title('Login - PWM');

		this.componentIsMounted = true;
	}
	componentWillUnmount(){
		this.componentIsMounted = false;
	}

	logIn = () => {
		this.setState({ loading: true });
		const { login, password } = this.state;
		const values = JSON.stringify({ login, password });

		api.post('/login', values)
		.then((res) => {
			this.setState({ loading: false });
			
			//JWT
			const token = res.data.response;
			if (token) {
				localStorage.setItem('app-token', token);
				this.props.history.push('/');
			}
		})
		.catch((error) => {
			this.setState({ authValidation: error.response === undefined ? 'Serviço indisponível, por favor aguarde alguns segundos e tente novamente':
				error.response.data.status === "422" ? 'Usuário ou senha inválidos!':
				'Serviço indisponível, por favor aguarde alguns segundos e tente novamente'
			});
			
			this.setState({ loading: false });
			this.cleanNotification();
		});
	}

	handleLoginChange = (e) => {
		this.setState({login: e.target.value});
	}
	handlePasswordChange = (e) => {
		this.setState({password: e.target.value});
	}
	cleanNotification = () => {
		var cleanUp = setTimeout(() => {
			this.componentIsMounted ? this.setState({ authValidation: '' }) : clearTimeout(cleanUp);
		}, 7000);
	}
	
	render() {
		const { authValidation, loading } = this.state;
			return(
				<main className="login-page fadeInComponent">
					<div className="g login-overlay">
						<div className="register-col">
							<p className="register-title">
								Seja Bem-Vindo!
							</p>
							<p className="register-text">
								Conheça seus novos colegas de equipe a um click.
							</p>
							<p className="register-action">
								Ainda não tem uma conta?
							</p>
							<Link className="register-link" to={'/register'}>Criar Conta</Link>
						</div>

						<div className="login-col">
							
							<form className="login-form">
								<p className="login-title">
									Login
								</p>
								<input id="email" className="input-field" onChange={this.handleLoginChange} type="text" placeholder="Usuário"></input>

								<input id="password" className="input-field" onChange={this.handlePasswordChange} onKeyDown={(e) => {return e.which === 13 || e.keyCode === 13 ? this.logIn() : false }} type="password" placeholder="Senha"></input>
							</form>
							<button className="login-button" onClick={this.logIn}>Entrar</button>
							<div className="validation">{authValidation}</div>
							<br />
							{/* <Link className="recover-link" to={'/'} >Esqueceu Sua Senha?</Link> */}
							<Link className="recover-link" to={'/register'}>Cadastre-se</Link>
						</div>
					</div>
					{loading &&
						<FullScreenLoading text="Autenticando . . ." />
					}
					
				</main>
			)
	}
}