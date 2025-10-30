import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LogoutButton from '../components/LogoutButton'

const Dashboard = () => {
  const { user } = useAuth0()

  return (
    <main className="page">
      <h1>Panel de control</h1>
      <section>
        <p>
          Sesión iniciada como <strong>{user?.name ?? user?.email}</strong>.
        </p>
        <p>
          Desde aquí puedes gestionar el listado de{' '}
          <Link to="/users">usuarios registrados</Link> o registrar uno nuevo en{' '}
          <Link to="/users/new">crear usuario</Link>.
        </p>
        <LogoutButton className="button" />
      </section>
    </main>
  )
}

export default Dashboard
