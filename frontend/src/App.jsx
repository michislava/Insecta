import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import Deck from './pages/Deck/Deck'
import LoginPage from './pages/Login/Login'
import RootPage from './pages/Root/Root'
import FightPage from './pages/Fight/fight.jsx'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootPage />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'deck', element: <Deck /> },
        { path: 'fight', element: <FightPage />}
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App
