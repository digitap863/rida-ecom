import axios from "axios"

export const url =import.meta.env.MODE === "development"?'http://localhost:8080/api':'https://rida-ecom-1.onrender.com'
// export const url ='http://localhost:8080/api'
export const AxiosAdmin = axios.create({
    baseURL:url
})