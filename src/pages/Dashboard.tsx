import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getCurrentUser, type UserSummary } from '../api/users'
import Loading from '../components/Loading'
import LogoutButton from '../components/LogoutButton'

const Dashboard = () => {
  const { user } = useAuth0()
  const [profile, setProfile] = useState<UserSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (isMounted) {
          setProfile(currentUser)
          setError(null)
        }
      } catch (err) {
        console.warn('Error retrieving current user', err)
        if (isMounted) {
          setError('No se pudo cargar tu información. Verifica la API.')
        }
      } finally {
        if (isMounted) {
          setIsFetching(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  if (isFetching) {
    return <Loading message="Cargando tu información..." />
  }

  return (
    <main className="page">
      <h1>Panel de control</h1>
      <section>
        <h2>Perfil</h2>
        <p>
          Sesión iniciada como <strong>{user?.name ?? user?.email}</strong>.
        </p>
        <LogoutButton className="button" />
        {profile && (
          <ul>
            <li>Nombre: {profile.name}</li>
            <li>Correo: {profile.email}</li>
            <li>ID: {profile.id}</li>
          </ul>
        )}
        {error && <p className="error">{error}</p>}
      </section>
    </main>
  )
}

export default Dashboard
