import { useEffect, useState } from 'react';
import { getUsers, type PagedUsers } from '../../api/users';
import { Link } from 'react-router-dom';

export default function UsersListPage() {
  const [data, setData] = useState<PagedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const res = await getUsers(0,10); if (alive) setData(res); }
      catch (e) { setErr('No se pudo cargar la lista de usuarios.'); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <main className="page">Cargando usuarios…</main>;
  if (err) return <main className="page"><p className="error">{err}</p></main>;

  return (
    <main className="page">
      <h1>Usuarios</h1>
      <div style={{ marginBottom: 12 }}>
        <Link className="button" to="/users/new">+ Registrar usuario</Link>
      </div>
      <table className="table">
        <thead><tr><th>Nombre</th><th>Email</th><th>ID</th></tr></thead>
        <tbody>
          {data?.users?.length ? data.users.map(u => (
            <tr key={u.id}><td>{u.firstName} {u.lastName}</td><td>{u.email}</td><td>{u.id}</td></tr>
          )) : <tr><td colSpan={3}>Sin usuarios</td></tr>}
        </tbody>
      </table>
    </main>
  );
}
