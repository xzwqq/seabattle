import axios from 'axios';

export const getQueue = async () => {
	const response = await axios.get(`${import.meta.env.VITE_API_URL}/ready`);
	return response.data;
};

export const postTable = async table => {
	const response = await axios.post(`${import.meta.env.VITE_API_URL}/ready`, table);
	return response.data;
};
