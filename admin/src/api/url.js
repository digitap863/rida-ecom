import axios from "axios"

export const url =import.meta.env.MODE === "development"?'http://localhost:8080/api/admin':'https://rida-ecom-1.onrender.com'
export const AxiosAdmin = axios.create({
    baseURL:url
})