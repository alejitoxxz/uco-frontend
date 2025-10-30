import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, type CreateUserRequest } from '../../api/users'
import { getCities, getCountries, getDepartments, type City, type Country, type Department } from '../../api/locations'

export default function UserCreatePage() {
  const [formState, setFormState] = useState<CreateUserRequest>({
    idType: '',
    idNumber: '',
    firstName: '',
    secondName: '',
    firstSurname: '',
    secondSurname: '',
    homeCity: '',
    email: '',
    mobileNumber: '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [locationsError, setLocationsError] = useState<string | null>(null)

  const [countries, setCountries] = useState<Country[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')

  const [countryRequestId, setCountryRequestId] = useState(0)
  const [departmentRequestId, setDepartmentRequestId] = useState(0)
  const [cityRequestId, setCityRequestId] = useState(0)

  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    setLoadingCountries(true)
    setLocationsError(null)
    ;(async () => {
      try {
        const res = await getCountries()
        if (!active) return
        setCountries(res)
      } catch (error) {
        console.error(error)
        if (!active) return
        setLocationsError('No se pudieron cargar los países disponibles. Inténtalo de nuevo.')
      } finally {
        if (!active) return
        setLoadingCountries(false)
      }
    })()
    return () => {
      active = false
    }
  }, [countryRequestId])

  useEffect(() => {
    if (!selectedCountry) {
      setDepartments([])
      setSelectedDepartment('')
      setCities([])
      setFormState((state) => ({ ...state, homeCity: '' }))
      return
    }

    let active = true
    setLoadingDepartments(true)
    setLocationsError(null)
    setDepartments([])
    setCities([])
    setFormState((state) => ({ ...state, homeCity: '' }))
    ;(async () => {
      try {
        const res = await getDepartments(selectedCountry)
        if (!active) return
        setDepartments(res)
      } catch (error) {
        console.error(error)
        if (!active) return
        setLocationsError('No se pudieron cargar los departamentos seleccionados. Intenta nuevamente.')
      } finally {
        if (!active) return
        setLoadingDepartments(false)
      }
    })()

    return () => {
      active = false
    }
  }, [selectedCountry, departmentRequestId])

  useEffect(() => {
    if (!selectedDepartment) {
      setCities([])
      setFormState((state) => ({ ...state, homeCity: '' }))
      return
    }

    let active = true
    setLoadingCities(true)
    setLocationsError(null)
    setCities([])
    setFormState((state) => ({ ...state, homeCity: '' }))
    ;(async () => {
      try {
        const res = await getCities(selectedDepartment)
        if (!active) return
        setCities(res)
      } catch (error) {
        console.error(error)
        if (!active) return
        setLocationsError('No se pudieron cargar las ciudades seleccionadas. Revisa tu conexión.')
      } finally {
        if (!active) return
        setLoadingCities(false)
      }
    })()

    return () => {
      active = false
    }
  }, [selectedDepartment, cityRequestId])

  const onFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((state) => ({ ...state, [name]: value }))
  }

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setSelectedCountry(value)
    setSelectedDepartment('')
  }

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setSelectedDepartment(value)
  }

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setFormState((state) => ({ ...state, homeCity: value }))
  }

  const handleRetryLocations = () => {
    if (!selectedCountry) {
      setCountryRequestId((id) => id + 1)
      return
    }

    if (!selectedDepartment) {
      setDepartmentRequestId((id) => id + 1)
      return
    }

    setCityRequestId((id) => id + 1)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (saving) return

    if (
      !formState.idType ||
      !formState.idNumber ||
      !formState.firstName ||
      !formState.firstSurname ||
      !formState.homeCity ||
      !formState.email ||
      !formState.mobileNumber
    ) {
      setErr('Completa los campos obligatorios antes de continuar.')
      return
    }

    setSaving(true)
    try {
      await createUser(formState)
      navigate('/users', { replace: true })
    } catch (error) {
      console.error(error)
      setErr('No se pudo crear el usuario. Revisa los permisos y la información ingresada.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1>Registrar usuario</h1>
          <p>Completa la información para registrar un nuevo usuario en la plataforma.</p>
        </div>
      </header>

      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <label className="form-control" htmlFor="idType">
            Tipo de identificación*
            <input
              id="idType"
              name="idType"
              value={formState.idType}
              onChange={onFieldChange}
              placeholder="CC, CE, TI..."
              autoComplete="off"
              required
            />
          </label>

          <label className="form-control" htmlFor="idNumber">
            Número de identificación*
            <input
              id="idNumber"
              name="idNumber"
              value={formState.idNumber}
              onChange={onFieldChange}
              placeholder="Ingresa el número"
              autoComplete="off"
              required
            />
          </label>

          <label className="form-control" htmlFor="firstName">
            Primer nombre*
            <input
              id="firstName"
              name="firstName"
              value={formState.firstName}
              onChange={onFieldChange}
              placeholder="Ej. Laura"
              autoComplete="given-name"
              required
            />
          </label>

          <label className="form-control" htmlFor="secondName">
            Segundo nombre
            <input
              id="secondName"
              name="secondName"
              value={formState.secondName ?? ''}
              onChange={onFieldChange}
              placeholder="Opcional"
              autoComplete="given-name"
            />
            <span className="form-helper">Este campo es opcional.</span>
          </label>

          <label className="form-control" htmlFor="firstSurname">
            Primer apellido*
            <input
              id="firstSurname"
              name="firstSurname"
              value={formState.firstSurname}
              onChange={onFieldChange}
              placeholder="Ej. González"
              autoComplete="family-name"
              required
            />
          </label>

          <label className="form-control" htmlFor="secondSurname">
            Segundo apellido
            <input
              id="secondSurname"
              name="secondSurname"
              value={formState.secondSurname ?? ''}
              onChange={onFieldChange}
              placeholder="Opcional"
              autoComplete="family-name"
            />
          </label>

          <label className="form-control" htmlFor="country">
            País*
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={loadingCountries || countries.length === 0}
              required
            >
              <option value="">
                {loadingCountries ? 'Cargando países...' : 'Selecciona un país'}
              </option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control" htmlFor="department">
            Departamento*
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              disabled={!selectedCountry || loadingDepartments || departments.length === 0}
              required
            >
              <option value="">
                {!selectedCountry
                  ? 'Selecciona primero un país'
                  : loadingDepartments
                    ? 'Cargando departamentos...'
                    : 'Selecciona un departamento'}
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control" htmlFor="homeCity">
            Ciudad*
            <select
              id="homeCity"
              value={formState.homeCity}
              onChange={handleCityChange}
              disabled={!selectedDepartment || loadingCities || cities.length === 0}
              required
            >
              <option value="">
                {!selectedDepartment
                  ? 'Selecciona primero un departamento'
                  : loadingCities
                    ? 'Cargando ciudades...'
                    : 'Selecciona una ciudad'}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control" htmlFor="email">
            Correo electrónico*
            <input
              id="email"
              type="email"
              name="email"
              value={formState.email}
              onChange={onFieldChange}
              placeholder="usuario@uco.edu.co"
              autoComplete="email"
              required
            />
          </label>

          <label className="form-control" htmlFor="mobileNumber">
            Teléfono móvil*
            <input
              id="mobileNumber"
              name="mobileNumber"
              value={formState.mobileNumber}
              onChange={onFieldChange}
              placeholder="Ej. 3001234567"
              autoComplete="tel"
              required
            />
          </label>
        </div>

        {locationsError && (
          <div className="alert alert--error" role="alert">
            <span aria-hidden>⚠️</span>
            <div>
              <p style={{ margin: 0 }}>{locationsError}</p>
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: '0.75rem' }}
                onClick={handleRetryLocations}
              >
                Reintentar carga
              </button>
            </div>
          </div>
        )}

        {err && (
          <div className="alert alert--error" role="alert">
            <span aria-hidden>⚠️</span>
            <span>{err}</span>
          </div>
        )}

        <div className="form-actions">
          <Link to="/users" className="btn btn-secondary">
            Cancelar
          </Link>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Registrar usuario'}
          </button>
        </div>
      </form>
    </main>
  )
}
