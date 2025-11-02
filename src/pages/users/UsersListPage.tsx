import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { getUsers } from '../../api/users'
import { sendVerificationCode } from '../../api/verification'
import EmptyState from '../../components/ui/EmptyState'
import ErrorAlert from '../../components/ui/ErrorAlert'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageSizeSelect from '../../components/ui/PageSizeSelect'
import Pagination from '../../components/ui/Pagination'
import VerificationModal from '../../components/VerificationModal'
import UsersTable from './UsersTable'
import styles from './UsersListPage.module.css'

interface UserSummary {
  id: string
  firstName: string
  lastName?: string | null
  email: string
  mobileNumber?: string | null
  emailConfirmed?: boolean | null
  mobileNumberConfirmed?: boolean | null
}

interface UsersPage {
  users: UserSummary[]
  page: number
  size: number
  totalElements: number
}

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

const resolveToast = () => {
  if (typeof window === 'undefined') return undefined
  return (window as Window & { toast?: { success?: (message: string) => void; error?: (message: string) => void } }).toast
}

const UsersListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<UsersPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [verificationContext, setVerificationContext] = useState<{
    userId: string
    contact: string
    type: 'email' | 'mobile'
  } | null>(null)
  const location = useLocation()

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
      setFeedback(null)

      try {
        const response = (await getUsers(page, size)) as UsersPage
        if (!cancelled) {
          setData(response)
        }
      } catch (err) {
        console.error(err)
        if (isAxiosError(err)) {
          console.error(err.response?.data)
        }
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

  const refreshSignal = (location.state as { refresh?: number } | null)?.refresh

  useEffect(() => {
    if (!refreshSignal) return
    setRefreshIndex((value) => value + 1)
  }, [refreshSignal])

  useEffect(() => {
    if (!feedback) return

    const timeout = setTimeout(() => {
      setFeedback(null)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [feedback])

  const requestVerification = async (user: UserSummary, type: 'email' | 'mobile') => {
    const contactValue =
      type === 'email' ? user.email.trim() : (user.mobileNumber?.toString().trim() ?? '')

    if (!contactValue) {
      setFeedback({ type: 'error', message: 'El contacto seleccionado no está disponible.' })
      return
    }

    try {
      setFeedback(null)
      await sendVerificationCode(user.id, type)
      const toast = resolveToast()
      const label = contactValue
      if (toast?.success) {
        toast.success(`Código enviado a ${label}.`)
      }
      setFeedback({ type: 'success', message: `Código enviado a ${label}.` })
      setVerificationContext({ userId: user.id, contact: contactValue, type })
    } catch (err) {
      console.error(err)
      if (isAxiosError(err)) {
        console.error(err.response?.data)
      }
      let errorMessage = 'No se pudo enviar el código de verificación. Intenta nuevamente.'
      if (isAxiosError(err)) {
        const detailed = (err as typeof err & { __niceMessage?: string }).__niceMessage
        errorMessage = detailed ?? err.message ?? errorMessage
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setFeedback({ type: 'error', message: errorMessage })
    }
  }

  const handleVerificationSuccess = () => {
    if (!verificationContext) return

    const { userId, type } = verificationContext

    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        users: prev.users.map((item) => {
          if (item.id !== userId) return item
          if (type === 'email') {
            return { ...item, emailConfirmed: true }
          }
          return { ...item, mobileNumberConfirmed: true }
        }),
      }
    })

    setFeedback({ type: 'success', message: 'Contacto verificado correctamente.' })
  }

  const handleCloseModal = () => {
    setVerificationContext(null)
  }

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

      {feedback && (
        <div
          className={`alert ${feedback.type === 'success' ? 'alert--success' : 'alert--error'}`.trim()}
          role="status"
          aria-live="assertive"
        >
          <span aria-hidden>{feedback.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{feedback.message}</span>
        </div>
      )}

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

        {!loading && !error && users.length > 0 && (
          <UsersTable
            data={users}
            onConfirmEmail={(user) => void requestVerification(user, 'email')}
            onConfirmMobile={(user) => void requestVerification(user, 'mobile')}
          />
        )}
      </div>

      {!loading && !error && data ? (
        <footer className={styles.footer}>
          <Pagination page={page} size={size} totalElements={data.totalElements} onPageChange={handlePageChange} />
        </footer>
      ) : null}

      <VerificationModal
        show={Boolean(verificationContext)}
        contact={verificationContext?.contact ?? ''}
        onClose={handleCloseModal}
        onVerified={handleVerificationSuccess}
      />
    </main>
  )
}

export default UsersListPage
