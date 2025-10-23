import { Link } from 'react-router-dom'

const NotAuthorized = () => (
  <main className="page">
    <h1>No autorizado</h1>
    <p>No tienes permisos para acceder a esta sección.</p>
    <p>
      Regresa al <Link to="/">inicio</Link> o contacta a un administrador si crees que es un
      error.
    </p>
  </main>
)

export default NotAuthorized
