import React, { Component } from 'react';
import './style.css';

export default class FullScreenLoading extends Component {

	render(){
		const { text } = this.props;
		return(
			<div className="full-screen-loading">
				<div className="full-screen-loading-overlay"></div>
				<div className="full-screen-loading-img">
					<div className="full-screen-loading-text">{text}</div>
				</div>				
			</div>
		)
	}
}