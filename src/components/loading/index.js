import React, { Component } from 'react';
import './style.css';

import loading_icon from './assets/load.svg';

export default class Loading extends Component {

	render(){
		const { bgColor } = this.props;
		return(
			<div className="loading-overlay">
				<div style={{backgroundColor: bgColor}}>
					<img className="loading-spin" src={loading_icon} alt="loading" />
				</div>
			</div>
		)
	}
}