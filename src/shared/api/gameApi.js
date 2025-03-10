import axios from 'axios'

export const getTrunApi = async () =>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/turn`)
    return response.data
}

export const getTableApi = async () =>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/players`)
    return response.data
}

export const postShootApi = async (data) =>{
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/shot`, data)
    return response.data
}