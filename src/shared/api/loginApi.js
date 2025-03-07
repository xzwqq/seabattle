import axios from 'axios'


export const postUser = async (data) =>{
    const response = await axios.post(`${import.meta.env.VITE_API_URL}`, data)
    return response.data
} 