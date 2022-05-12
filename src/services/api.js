import axios from 'axios';

const api = axios.create({
	baseURL: 'http://pwm.rangelpereira.com',
});

export default api;