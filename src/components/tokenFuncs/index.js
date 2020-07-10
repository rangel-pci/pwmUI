import api from '../../services/api';
import jwt from 'jsonwebtoken';

const token = {
	update(__callBack){
		const currentToken = localStorage.getItem('app-token');
		api.defaults.headers.post['Authorization'] = currentToken;
		
		api.post('/login', JSON.stringify({renew_token: ''}))
		.then((res) => {
			const newToken = res.data.response;

			localStorage.removeItem('app-token');
			localStorage.setItem('app-token', newToken);

			__callBack();
		})
		.catch((err) => {
			console.log(err.response.data.response);
		});
	},
	getTokenDecoded(){
		const app_token = localStorage.getItem('app-token');
		const token = jwt.decode(app_token);

		return token;
	}
}

export default token;