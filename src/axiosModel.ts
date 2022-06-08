import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/selfserver1/';
axios.interceptors.request.use(config => {
    return config
}, (error) => {
    return Promise.reject(error)
})
axios.interceptors.response.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})
export default axios;