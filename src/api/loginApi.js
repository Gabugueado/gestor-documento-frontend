import axios from 'axios'


const loginApi = axios.create({
    baseURL: 'http://localhost:8000/login',
})

export default loginApi


