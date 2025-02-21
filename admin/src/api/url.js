import axios from "axios"

export const url = import.meta.env.MODE === "development" 
  ? 'http://localhost:8080/api/admin'
  : '/api/admin'


// export const url = 'https://rida-ecom-1.onrender.com/api/admin'


export const AxiosAdmin = axios.create({
    baseURL:url
})