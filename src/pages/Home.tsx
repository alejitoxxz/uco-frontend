import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from '../components/LogoutButton'

const Home = () => {
  const { isAuthenticated, user } = useAuth0()

  return (
    <main className="page">
      <h1>Bienvenido a la plataforma UCO</h1>
      {isAuthenticated ? (
        <>
          <p>
            Hola, <strong>{user?.name ?? user?.email}</strong>. Ve al{' '}
            <Link to="/dashboard">panel de control</Link>.
          </p>
          <LogoutButton className="button" />
        </>
      ) : (
        <p>
          Inicia sesión para acceder a tus recursos. Visita la página de{' '}
          <Link to="/login">inicio de sesión</Link>.
        </p>
      )}
    </main>
  )
}

export default Home
