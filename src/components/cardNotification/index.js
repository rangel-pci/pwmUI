import React, { Component } from 'react';
import './style.css';

export default class CardNotification extends Component {
	constructor(props){
		super(props)
		this.state = {
		}
	}

	render() {
		const { text, type, className} = this.props;

		return(
			<div className={className+" card-notification fadeInComponent "+type}>
				<div className="notification-text">
					<p>{text}</p>
				</div>
			</div>
		)
	}
}