import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import Deck from './pages/Deck/Deck'
import LoginPage from './pages/Login/Login'
import ShootPage from './pages/Shoot/Shoot'
import RootPage from './pages/Root/Root'
import FightPage from './pages/Fight/fight.jsx'
import TradePage from './pages/Trade/Trade.jsx'
import ProfilePage from './pages/Profile/Profile.jsx'
import RegisterPage from './pages/Register/Register.jsx'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootPage />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'deck', element: <Deck /> },
        { path: 'fight', element: <FightPage /> },
        { path: 'trade/:id?', element: <TradePage /> },
        { path: 'profile', element: <ProfilePage /> },
      ],
    },
    {
      path: '/shoot',
      element: <ShootPage />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App
