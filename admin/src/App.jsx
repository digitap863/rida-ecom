import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, lazy } from 'react'
import AdminPrivateRoutes from './util/AdminPrivateRoutes'
import AdminPublicRoutes from './util/AdminPublicRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'




const Dashboard = lazy(() => import("./pages/Dashboard"))
const Login = lazy(() => import("./pages/Login"))

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
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter >
    </QueryClientProvider>
  )
}

export default App
