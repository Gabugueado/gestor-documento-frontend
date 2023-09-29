import axios from 'axios'


const docApi = axios.create({
    baseURL: 'http://localhost:8000/docs',
})

export default docApi


