import React from 'react'
import { useAuth } from '../hooks/Authprovider'
import UserPage from '../pages/UserPage'
import Home from '../pages/Home'

const ProtectedRoute = () => {
    const auth = useAuth()
    if (!auth.user) return <Home/>
    return <UserPage />
}

export default ProtectedRoute