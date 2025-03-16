import classes from './login.module.css'
import logo from '../../assets/images/logo.png'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../store/auth'

import { hash, getCsrfToken } from '../../utils/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    const passwordHash = hash(password)

    const response = await fetch(`http://localhost:3000/login`, {
      method: 'POST',
      body: JSON.stringify({ username, passwordHash }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
    })

    const responseData = await response.json()

    if (!response.ok) {
      setIsLoggedIn(false)
      setError(responseData.message)
      setPassword('')
      return
    }

    setIsLoggedIn(true)
    setError('')
    navigate('/')
  }

  return (
    <div className={classes.desktopCompatability}>
      {error && <p className='error'>{error}</p>}
      <div className={classes.content}>
        <div className={classes.divWithLogo}>
          <img className={classes.logo} src={logo} alt='logo' />
          <p className={classes.projectName}>Insecta</p>
        </div>
        <div className={classes.divWithForm}>
          {error && <p className='error'>{error}</p>}
          <form className={classes.form} onSubmit={handleSubmit}>
            <input
              className={classes.input}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              className={classes.input}
              type='password'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button>Log in</button>
          </form>
        </div>
      </div>
    </div>
  )
}
