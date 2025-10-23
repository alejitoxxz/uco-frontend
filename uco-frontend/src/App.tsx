import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import AppRouter from './routes/Router'
import { attachTokenInterceptor } from './api/apiClient'
import './App.css'

const App = () => {
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    attachTokenInterceptor(getAccessTokenSilently)
  }, [getAccessTokenSilently])

  return <AppRouter />
}

export default App
