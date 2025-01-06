import axios from "axios"

export const url =import.meta.env.MODE === "development"?'http://localhost:8080/api/admin':'https://ridame.ae/api/admin'
export const AxiosAdmin = axios.create({
    baseURL:url
})