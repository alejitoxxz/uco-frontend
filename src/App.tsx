import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAuth0 } from '@auth0/auth0-react'
import { attachTokenInterceptor } from './api/apiClient'
import AppRouter from './routes/Router'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
 
// Componente ErrorBoundary para capturar errores de renderizado
class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null as Error | null }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('[Debug] ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      console.error('[Debug] Error state:', this.state.error)
      return null
    }
    return this.props.children
  }
}

const App = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()
 
  useEffect(() => {
    attachTokenInterceptor(getAccessTokenSilently)
  }, [getAccessTokenSilently])
  const avatarLetter = (user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()
 
  return (
    <ErrorBoundary>
      <div className="app-shell">
        <header className="app-header">
          <NavLink to="/" className="brand">
            <span className="brand__dot" aria-hidden />
            <span>UCO Admin</span>
          </NavLink>
          <nav className="app-nav">
            <NavLink to="/" className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}>
              Inicio
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}
            >
              Panel
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}>
              Usuarios
            </NavLink>
          </nav>
          {isAuthenticated ? (
            <div className="app-user" aria-live="polite">
              <span className="app-user__avatar" aria-hidden>
                {avatarLetter}
              </span>
              <span className="app-user__name">{user?.name ?? user?.email}</span>
            </div>
          ) : (
            <span className="app-guest">Invitado</span>
          )}
        </header>
        <div className="app-content">
          <AppRouter />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </ErrorBoundary>
  )
 }

export default App
