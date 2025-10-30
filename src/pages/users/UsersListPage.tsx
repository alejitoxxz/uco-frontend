import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../components/Loading'
import { getUsers, type PagedUsers } from '../../api/users'

export default function UsersListPage() {
  const [data, setData] = useState<PagedUsers | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await getUsers(0, 10)
      setData(res)
    } catch (error) {
      console.error(error)
      setErr('No se pudo cargar la lista de usuarios. Intenta nuevamente en unos segundos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p>Consulta y gestiona los usuarios registrados en la plataforma.</p>
        </div>
        <div className="page-actions">
          <Link className="btn btn-accent" to="/users/new">
            Registrar nuevo usuario
          </Link>
        </div>
      </header>

      {loading && (
        <section className="card status-card" aria-live="polite">
          <Loading message="Cargando usuarios..." />
        </section>
      )}

      {!loading && err && (
        <section className="card" role="alert">
          <div className="alert alert--error">
            <span aria-hidden>⚠️</span>
            <div>
              <p style={{ margin: 0 }}>{err}</p>
              <p style={{ margin: '0.35rem 0 0' }}>Verifica tu conexión o tus permisos e intenta nuevamente.</p>
            </div>
          </div>
          <div className="card-actions card-actions--start">
            <button type="button" className="btn btn-primary" onClick={() => fetchUsers()}>
              Reintentar
            </button>
            <Link to="/" className="btn btn-outline">
              Ir al inicio
            </Link>
          </div>
        </section>
      )}

      {!loading && !err && (
        <>
          <section className="card card--accent">
            <p className="metric-title">Usuarios totales</p>
            <p className="metric-value">{data?.totalElements ?? 0}</p>
            <p className="form-helper">
              Mostrando {data?.users?.length ?? 0} registros más recientes en esta vista.
            </p>
          </section>

          <section className="card table-card" aria-live="polite">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.length ? (
                  data.users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>
                          {u.firstName} {u.lastName}
                        </strong>
                      </td>
                      <td>{u.email}</td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>{u.id}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                      No hay usuarios registrados todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </main>
  )
}
