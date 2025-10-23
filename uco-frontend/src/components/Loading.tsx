interface LoadingProps {
  message?: string
}

const Loading = ({ message = 'Cargando...' }: LoadingProps) => (
  <div className="loading">
    <div className="spinner" aria-hidden />
    <p>{message}</p>
  </div>
)

export default Loading
