import axios from "axios"

// export const url = process.env.NODE_ENV === "development" 
//   ? 'http://localhost:8080/api/admin'
//   : 'https://rida-ecom-1.onrender.com'
// export const url = 'http://localhost:8080/api/admin'

export const url = 'https://rida-ecom-1.onrender.com/api/admin'


export const AxiosAdmin = axios.create({
    baseURL:url
})