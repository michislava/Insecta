import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import Deck from './pages/Deck/Deck'
import LoginPage from './pages/Login/Login'
import ShootPage from './pages/Shoot/Shoot'
import RootPage from './pages/Root/Root'
import FightPage from './pages/Fight/fight.jsx'
import TradePage from './pages/Trade/Trade.jsx'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootPage />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'deck', element: <Deck /> },
        { path: 'fight', element: <FightPage /> },
        { path: 'trade/:id?', element: <TradePage /> }
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
