import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser, type CreateUserRequest } from '../../api/users'

interface FormState {
  idType: string
  idNumber: string
  firstName: string
  secondName: string
  firstSurname: string
  secondSurname: string
  homeCity: string
  email: string
  mobileNumber: string
}

const initialState: FormState = {
  idType: '',
  idNumber: '',
  firstName: '',
  secondName: '',
  firstSurname: '',
  secondSurname: '',
  homeCity: '',
  email: '',
  mobileNumber: '',
}

const REQUIRED_FIELDS: Array<keyof FormState> = [
  'idType',
  'idNumber',
  'firstName',
  'firstSurname',
  'homeCity',
  'email',
  'mobileNumber',
]

const UserCreatePage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const missingField = REQUIRED_FIELDS.find((field) => !form[field].trim())

    if (missingField) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }

    setIsSubmitting(true)

    const payload: CreateUserRequest = {
      idType: form.idType,
      idNumber: form.idNumber.trim(),
      firstName: form.firstName.trim(),
      secondName: form.secondName.trim() || undefined,
      firstSurname: form.firstSurname.trim(),
      secondSurname: form.secondSurname.trim() || undefined,
      homeCity: form.homeCity.trim(),
      email: form.email.trim(),
      mobileNumber: form.mobileNumber.trim(),
    }

    try {
      await createUser(payload)
      navigate('/users')
    } catch (err) {
      console.error('Error creating user', err)
      setError('No fue posible crear el usuario. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page">
      <h1>Registrar usuario</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="grid">
          <label>
            Tipo de documento*
            <select name="idType" value={form.idType} onChange={handleChange} required>
              <option value="">Selecciona una opción</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="PA">Pasaporte</option>
            </select>
          </label>
          <label>
            Número de documento*
            <input name="idNumber" value={form.idNumber} onChange={handleChange} required />
          </label>
          <label>
            Primer nombre*
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Segundo nombre
            <input name="secondName" value={form.secondName} onChange={handleChange} />
          </label>
          <label>
            Primer apellido*
            <input
              name="firstSurname"
              value={form.firstSurname}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Segundo apellido
            <input
              name="secondSurname"
              value={form.secondSurname}
              onChange={handleChange}
            />
          </label>
          <label>
            Ciudad de residencia (UUID)*
            <input name="homeCity" value={form.homeCity} onChange={handleChange} required />
          </label>
          <label>
            Correo electrónico*
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Número de celular*
            <input
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar usuario'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  )
}

export default UserCreatePage
