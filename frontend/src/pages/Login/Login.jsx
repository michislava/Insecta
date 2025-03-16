import classes from './login.module.css'
import logo from '../../assets/images/logo_placeholder.png'
import { useState } from 'react'

import { hash } from '../../utils/auth'
import { getCsrfToken } from '../../utils/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const passHash = hash(password);

    const response = await fetch(`http://localhost:3000/login`, {
      method: 'POST',
      body: JSON.stringify({ username, email, passHash }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': await getCsrfToken()
      },
    });

    const responseData = await response.json();
  }

  return (
    <div className={classes.desktopCompatability}>
      <div className={classes.content}>
        <div className={classes.divWithLogo}>
          <img className={classes.logo} src={logo} alt='logo' />
          <p className={classes.projectName}>Insecta</p>
        </div>
        <div className={classes.divWithForm}>
          <button className={classes.googleLoginBtn}>Google Login</button>
          <p className={classes.orParagraph}>or</p>
          <form className={classes.form} onSubmit={handleSubmit}>
            <input
              className={classes.input}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input
              className={classes.input}
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
