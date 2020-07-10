import React, { Component } from 'react';
import Title from '../../components/documentTitle';
import './style.css';

export default class NotFound extends Component{
	componentDidMount(){
		Title('404 - PWM');
	}

	render(){
		return(
			<main className="fadeInComponent">
				<h1>404 Not Found</h1>
			</main>
		)
	}
}