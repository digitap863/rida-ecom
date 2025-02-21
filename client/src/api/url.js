import axios from "axios"

export const url = process.env.NODE_ENV === "development" ? 'http://localhost:8080/api' : '/api'



export const AxiosAdmin = axios.create({
    baseURL:url
})