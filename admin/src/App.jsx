import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, lazy } from 'react'
import AdminPrivateRoutes from './util/AdminPrivateRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'




const Dashboard = lazy(() => import("./pages/Dashboard"))
const Login = lazy(() => import("./pages/Login"))
const Category = lazy(() => import("./pages/Category"))
const Subcategory = lazy(() => import('./pages/Subcategory'))
const Manufacture = lazy(()=>import('./pages/Manufacture'))
const Products = lazy(()=>import('./pages/Products'))

function App() {


  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<h1 className='flex items-center justify-center'>404 Not Found</h1>} />
            <Route element={<AdminPrivateRoutes />} >
              <Route path="/" element={<Dashboard />} />
              <Route path="/category" element={<Category />} />
              <Route path="/subcategory" element={<Subcategory />} />
              <Route path='/manufacturer' element={<Manufacture/>} />
              <Route path='/product' element={<Products />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter >
    </QueryClientProvider>
  )
}

export default App
