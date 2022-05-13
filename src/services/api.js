import axios from 'axios';

const api = axios.create({
	baseURL: 'https://pwm.rangelpereira.com/api/v1',
});

export default api;