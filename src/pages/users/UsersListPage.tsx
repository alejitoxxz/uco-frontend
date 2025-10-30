import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getUsers, type UsersPage } from '../../api/users'
import EmptyState from '../../components/ui/EmptyState'
import ErrorAlert from '../../components/ui/ErrorAlert'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageSizeSelect from '../../components/ui/PageSizeSelect'
import Pagination from '../../components/ui/Pagination'
import UsersTable from './UsersTable'
import styles from './UsersListPage.module.css'

const PAGE_SIZES = [10, 20, 30, 50]
const DEFAULT_PAGE = 0
const DEFAULT_SIZE = 10

const sanitizePage = (value: string | null) => {
  if (!value) return DEFAULT_PAGE
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) || parsed < 0 ? DEFAULT_PAGE : parsed
}

const sanitizeSize = (value: string | null) => {
  if (!value) return DEFAULT_SIZE
  const parsed = Number.parseInt(value, 10)
  return PAGE_SIZES.includes(parsed) ? parsed : DEFAULT_SIZE
}

const UsersListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<UsersPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  const page = useMemo(() => sanitizePage(searchParams.get('page')), [searchParams])
  const size = useMemo(() => sanitizeSize(searchParams.get('size')), [searchParams])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    let changed = false

    if (searchParams.get('page') !== String(page)) {
      next.set('page', String(page))
      changed = true
    }

    if (searchParams.get('size') !== String(size)) {
      next.set('size', String(size))
      changed = true
    }

    if (changed) {
      setSearchParams(next, { replace: true })
    }
  }, [page, size, searchParams, setSearchParams])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getUsers({ page, size })
        if (!cancelled) {
          setData(response)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError('No se pudo cargar la lista de usuarios. Intenta nuevamente en unos segundos.')
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [page, size, refreshIndex])

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    next.set('size', String(size))
    setSearchParams(next)
  }

  const handleSizeChange = (nextSize: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(DEFAULT_PAGE))
    next.set('size', String(nextSize))
    setSearchParams(next)
  }

  const handleRetry = () => {
    setRefreshIndex((value) => value + 1)
  }

  const totalUsers = data?.totalElements ?? 0
  const users = data?.users ?? []

  return (
    <main className="page">
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Usuarios</h1>
          <p>Consulta y gestiona los usuarios registrados en la plataforma.</p>
        </div>
        <div className={styles.headerActions}>
          <PageSizeSelect value={size} onChange={handleSizeChange} />
          <Link className="btn btn-accent" to="/users/new" aria-label="Registrar nuevo usuario">
            Registrar nuevo usuario
          </Link>
        </div>
      </header>

      <section className={`card card--accent ${styles.metricsCard}`} aria-live="polite">
        <p className={styles.metricLabel}>Usuarios totales</p>
        <p className={styles.metricValue}>{totalUsers}</p>
        <p className={styles.metricHelper}>Mostrando {users.length} registros en esta vista.</p>
      </section>

      <div className={styles.contentStack}>
        {loading && (
          <section className="card" aria-busy="true">
            <LoadingSpinner label="Cargando usuarios..." />
          </section>
        )}

        {!loading && error && (
          <ErrorAlert
            message={error}
            actions={
              <>
                <button type="button" className="btn btn-primary" onClick={handleRetry} aria-label="Reintentar carga">
                  Reintentar
                </button>
                <Link to="/" className="btn btn-outline" aria-label="Ir al inicio">
                  Ir al inicio
                </Link>
              </>
            }
          >
            <p className={styles.metricHelper}>
              Verifica tu conexión o tus permisos e intenta nuevamente.
            </p>
          </ErrorAlert>
        )}

        {!loading && !error && users.length === 0 && (
          <EmptyState description="No hay usuarios registrados todavía." />
        )}

        {!loading && !error && users.length > 0 && <UsersTable data={users} />}
      </div>

      {!loading && !error && data ? (
        <footer className={styles.footer}>
          <Pagination page={page} size={size} totalElements={data.totalElements} onPageChange={handlePageChange} />
        </footer>
      ) : null}
    </main>
  )
}

export default UsersListPage
