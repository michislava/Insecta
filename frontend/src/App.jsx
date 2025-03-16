import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from './store/auth.js'
import { getCsrfToken } from './utils/auth.js'

import HomePage from './pages/Home/Home'
import Deck from './pages/Deck/Deck'
import LoginPage from './pages/Login/Login'
import ShootPage from './pages/Shoot/Shoot'
import RootPage from './pages/Root/Root'
import FightPage from './pages/Fight/fight.jsx'
import TradePage from './pages/Trade/Trade.jsx'
import ProfilePage from './pages/Profile/Profile.jsx'

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const csrfToken = await getCsrfToken()
        const response = await fetch('http://localhost:3000/check-session', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        })

        if (response.ok) {
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error('Session check failed:', error)
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [setIsLoggedIn])

  const router = createBrowserRouter([
    {
      path: '/',
      element: isLoggedIn ? <RootPage /> : <Navigate to='/login' />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: 'deck', element: <Deck /> },
        { path: 'fight', element: <FightPage /> },
        { path: 'trade/:id?', element: <TradePage /> },
        { path: 'profile', element: <ProfilePage /> },
      ],
    },
    {
      path: '/login',
      element: isLoggedIn ? <Navigate to='/' /> : <LoginPage />,
    },
    {
      path: '/shoot',
      element: isLoggedIn ? <ShootPage /> : <Navigate to='/login' />,
    },
  ])

  if (loading) return <div>Loading...</div>

  return <RouterProvider router={router} />
}

export default App
