import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading'
import { getUsers, type UserSummary } from '../../api/users'

const UsersListPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserSummary[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const data = await getUsers(0, 10)
        if (isMounted) {
          setUsers(data.users)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching users', err)
        if (isMounted) {
          setError('No fue posible cargar la lista de usuarios.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Usuarios</h1>
        <button
          type="button"
          className="button"
          onClick={() => navigate('/users/new')}
        >
          + Registrar usuario
        </button>
      </header>

      {isLoading && <Loading message="Cargando usuarios..." />}

      {error && <p className="error">{error}</p>}

      {!isLoading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo electrónico</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3}>No hay usuarios registrados.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default UsersListPage
