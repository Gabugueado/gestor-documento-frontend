import axios from 'axios'


const tokenApi = axios.create({
    baseURL: 'http://localhost:8000/token'
})

export default tokenApi


