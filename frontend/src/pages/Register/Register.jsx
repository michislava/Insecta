import { useState } from 'react'
import { getCsrfToken, hash } from '../../utils/auth'
import { useNavigate } from 'react-router'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== password2) {
      setError("Passwords don't match")
      return
    }

    const passHash = hash(password)

    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ username, email, passHash }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
    })

    const responseData = await response.json()

    if (!response.ok) {
      setError(responseData.message)
      return
    }

    setError('')
    navigate('/')
  }

  return (
    <>
      <h1>Welcome</h1>
      <p className='error'>{error}</p>
      <form onSubmit={handleSubmit}>
        <input
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder='Email'
          type='mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          placeholder='Confirm password'
          type='password'
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button>Register</button>
      </form>
    </>
  )
}
