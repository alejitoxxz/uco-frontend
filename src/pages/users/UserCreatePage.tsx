import { useState } from 'react';
import { createUser, type CreateUserRequest } from '../../api/users';
import { useNavigate } from 'react-router-dom';

export default function UserCreatePage() {
  const [f, setF] = useState<CreateUserRequest>({
    idType: '', idNumber: '', firstName: '', secondName: '',
    firstSurname: '', secondSurname: '', homeCity: '', email: '', mobileNumber: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target; setF(s => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setSaving(true);
    try {
      if (!f.idType || !f.idNumber || !f.firstName || !f.firstSurname || !f.homeCity || !f.email || !f.mobileNumber) {
        setErr('Completa los campos obligatorios'); setSaving(false); return;
      }
      await createUser(f); nav('/users', { replace: true });
    } catch {
      setErr('No se pudo crear el usuario (revisa permisos y la API).');
    } finally { setSaving(false); }
  };

  return (
    <main className="page">
      <h1>Registrar usuario</h1>
      <form className="form" onSubmit={onSubmit}>
        <div className="grid">
          <label>Tipo ID* <input name="idType" value={f.idType} onChange={onChange} /></label>
          <label>No. ID* <input name="idNumber" value={f.idNumber} onChange={onChange} /></label>
          <label>Primer nombre* <input name="firstName" value={f.firstName} onChange={onChange} /></label>
          <label>Segundo nombre <input name="secondName" value={f.secondName || ''} onChange={onChange} /></label>
          <label>Primer apellido* <input name="firstSurname" value={f.firstSurname} onChange={onChange} /></label>
          <label>Segundo apellido <input name="secondSurname" value={f.secondSurname || ''} onChange={onChange} /></label>
          <label>Ciudad (UUID)* <input name="homeCity" value={f.homeCity} onChange={onChange} /></label>
          <label>Email* <input type="email" name="email" value={f.email} onChange={onChange} /></label>
          <label>Móvil* <input name="mobileNumber" value={f.mobileNumber} onChange={onChange} /></label>
        </div>
        {err && <p className="error">{err}</p>}
        <button className="button" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
      </form>
    </main>
  );
}
