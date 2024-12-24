import axios from "axios"

export const url =import.meta.env.MODE === "development"?'http://localhost:3000/api':'https://ridame.ae/api'
export const AxiosAdmin = axios.create({
    baseURL:url
})