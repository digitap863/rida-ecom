import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, lazy } from 'react'
import AdminPrivateRoutes from './util/AdminPrivateRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'




const Dashboard = lazy(() => import("./pages/Dashboard"))
const Login = lazy(() => import("./pages/Login"))
const AddCategory = lazy(()=>import("./pages/AddCategory"))

function App() {
  const queryClient = new QueryClient()


  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route element={<AdminPrivateRoutes />} >
              <Route path="/" element={<Dashboard />} />
              <Route path="/category" element={<AddCategory />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter >
    </QueryClientProvider>
  )
}

export default App
