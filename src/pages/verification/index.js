import React, { Component } from 'react';
import queryString from 'query-string';
import api from '../../services/api';
import FullScreenLoading from '../../components/fullScreenLoading';
import CardNotification from '../../components/cardNotification';

import Title from '../../components/documentTitle';

import './style.css';

export default class Verification extends Component {
	constructor(props){
		super(props)
		this.state = {
			notify: { type: '', text:'', className: 'd-none' },
			loading: false,
			verifyMessage: '',
		}
	}

	componentDidMount(){
		Title('Verificação - PWM');

		this.componentIsMounted = true;
		const params = queryString.parse(this.props.location.search);

		if(params['key'] !== undefined){
			this.setState({ loading: true });
			this.verifyAccount(params['key']);
		}
	}

	componentWillUnmount(){
		this.componentIsMounted = false;
	}

	verifyAccount = (key) => {
		api.put('/verification', key)
		.then((res) => {
			
			this.setState({ loading: false });

			this.verifySuccess();
		})
		.catch((error) => {
			
			this.setState({ 
				verifyMessage: error.response === undefined ? 'Serviço indisponível, por favor aguarde alguns segundos e tente novamente':
					error.response.data.status === "409" ? 'O código informado pertence a um usuário que já foi devidamente ativado':
					error.response.data.status === "400" ? 'O código informado é inválido':
					'Serviço indisponível, por favor aguarde alguns segundos e tente novamente',
				loading: false
			});

			this.verifyFailure();
		})
	}

	verifySuccess = () => {
		var sec = 7;
		setInterval(() => {
			this.setState({ notify: 
				{type: 'message', text: 'Conta ativada! Você será redirecionado(a) para a página de login em '+sec+'.', className: 'd-block'}
			});
			sec--;
			return sec === -1 ? this.props.history.push('/login'): false;
		}, 1000);
	}
	verifyFailure = () => {
		const { verifyMessage } = this.state;
		this.setState({ notify: 
			{type: 'message', text: verifyMessage, className: 'd-block'}
		});
		this.cleanUp(7000);
	}

	resend = () => {
		this.setState({ notify: 
			{type: 'error', text: 'Função indisponível no momento.', className: 'd-block'}
		});
		this.cleanUp(5000);
	}

	cleanUp = (time) => {
		var cleanUp = setTimeout(() => {
			this.componentIsMounted ? this.setState({ notify: {className: 'd-none'} }): clearTimeout(cleanUp);
		}, time);
	}

	render() {
		const { notify, loading } = this.state;

		return(
			<main className="verification-page fadeInComponent">
				<div className="verify-card-container">
					<div className="verify-card-body">
						<h1 className="verify-card-title">Dê uma olhada em seu email</h1>
					    <p className="verify-card-text">
					    	Um link de verificação foi enviado ao seu email (esse processo pode levar alguns minutos), clique nele para ativar a sua conta.
					    </p>
					</div>
					<form className="verify-re-send" onSubmit={ (e) => { e.preventDefault() } }>
						<input className="verify-re-send-input" type="text" placeholder="Email" />
						<button className="verify-re-send-button" onClick={ this.resend } style={{ opacity: '0.5' }}>Reenviar link</button>
					</form>
				</div>

				<CardNotification className={notify.className}
				text={notify.text}
				type={notify.type}
				/>

				{loading &&
					<FullScreenLoading text="Ativando Conta. . ." />
				}

			</main>
		)
	}
}