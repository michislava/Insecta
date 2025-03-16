import { useEffect, useState } from 'react'
import ActionMenu from '../../components/ActionMenu/ActionMenu'
import { getCsrfToken } from '../../utils/auth'

export default function ProfilePage() {
  const [error, setError] = useState('')
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch('http://localhost:3000/profile', {
        method: 'GET',
        credentials: 'include',
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
    }

    fetchUser()
  }, [])

  return (
    <>
      <ActionMenu />
    </>
  )
}
