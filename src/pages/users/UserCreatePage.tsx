import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { createUser, type CreateUserRequest } from '../../api/users'
import { getCities, getCountries, getDepartments, type City, type Country, type Department } from '../../api/locations'
import { getIdTypes, type IdType } from '../../api/idTypes'

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
  const [failedRequest, setFailedRequest] = useState<'countries' | 'departments' | 'cities' | null>(null)

  const [idTypes, setIdTypes] = useState<IdType[]>([])
  const [loadingIdTypes, setLoadingIdTypes] = useState(false)
  const [errorIdTypes, setErrorIdTypes] = useState<string | null>(null)

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

  const loadIdTypes = useCallback(async () => {
    try {
      setLoadingIdTypes(true)
      setErrorIdTypes(null)
      const list = await getIdTypes()
      setIdTypes(list)
      setFormState((state) => {
        if (!state.idType) {
          return state
        }
        const exists = list.some((item) => {
          const optionValue = item.code ?? item.id
          return optionValue ? optionValue === state.idType : false
        })
        if (exists) {
          return state
        }
        return { ...state, idType: '' }
      })
    } catch (error) {
      console.warn(
        'IDTYPES_ERROR',
        isAxiosError(error) ? error.response?.status : undefined,
        isAxiosError(error) ? error.config?.url : undefined,
      )
      setIdTypes([])
      setFormState((state) => ({ ...state, idType: '' }))
      setErrorIdTypes('No se pudieron cargar los tipos de documento.')
    } finally {
      setLoadingIdTypes(false)
    }
  }, [])

  useEffect(() => {
    void loadIdTypes()
  }, [loadIdTypes])

  useEffect(() => {
    let active = true
    setLoadingCountries(true)
    setLocationsError(null)
    setFailedRequest(null)
    ;(async () => {
      try {
        const res = await getCountries()
        if (!active) return
        setCountries(res)
      } catch (error) {
        console.error(error)
        if (isAxiosError(error)) {
          console.error(error.response?.data)
        }
        if (!active) return
        setLocationsError('No se pudieron cargar los países. Inténtalo de nuevo.')
        setFailedRequest('countries')
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
    setFailedRequest(null)
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
        if (isAxiosError(error)) {
          console.error(error.response?.data)
        }
        if (!active) return
        setLocationsError('No se pudieron cargar los departamentos. Inténtalo de nuevo.')
        setFailedRequest('departments')
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
    setFailedRequest(null)
    setCities([])
    setFormState((state) => ({ ...state, homeCity: '' }))
    ;(async () => {
      try {
        const res = await getCities(selectedDepartment)
        if (!active) return
        setCities(res)
      } catch (error) {
        console.error(error)
        if (isAxiosError(error)) {
          console.error(error.response?.data)
        }
        if (!active) return
        setLocationsError('No se pudieron cargar las ciudades. Inténtalo de nuevo.')
        setFailedRequest('cities')
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
    setFailedRequest(null)
    setSelectedCountry(value)
    setSelectedDepartment('')
  }

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setFailedRequest(null)
    setSelectedDepartment(value)
  }

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setFailedRequest(null)
    setFormState((state) => ({ ...state, homeCity: value }))
  }

  const handleRetryLocations = () => {
    if (failedRequest === 'departments') {
      setDepartmentRequestId((id) => id + 1)
      return
    }

    if (failedRequest === 'cities') {
      setCityRequestId((id) => id + 1)
      return
    }

    setCountryRequestId((id) => id + 1)
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
      if (isAxiosError(error)) {
        console.error(error.response?.data)
      }
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
          <div className="form-control">
            <label htmlFor="idType">Tipo de identificación*</label>
            <select
              id="idType"
              name="idType"
              value={formState.idType ?? ''}
              onChange={(event) =>
                setFormState((state) => ({ ...state, idType: event.target.value }))
              }
              disabled={loadingIdTypes || !!errorIdTypes || idTypes.length === 0}
              aria-label="Selecciona el tipo de documento"
              title="Selecciona el tipo de documento"
              required
              className="input select"
            >
              <option value="">
                {loadingIdTypes ? 'Cargando tipos...' : 'Selecciona un tipo'}
              </option>
              {idTypes.map((type) => (
                <option key={type.id ?? type.code} value={type.code ?? type.id ?? ''}>
                  {type.name ?? type.description ?? type.code ?? type.id}
                </option>
              ))}
            </select>
            {loadingIdTypes ? (
              <div className="form-helper" role="status" aria-live="polite">
                <span
                  className="loader__spinner"
                  aria-hidden
                  style={{ width: '24px', height: '24px', borderWidth: '3px' }}
                />
                Cargando tipos de documento...
              </div>
            ) : null}
            {errorIdTypes ? (
              <div className="alert alert--info" role="alert">
                <span aria-hidden>ℹ️</span>
                <div>
                  <p style={{ margin: 0 }}>{errorIdTypes}</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => {
                      void loadIdTypes()
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : null}
            {!loadingIdTypes && !errorIdTypes && idTypes.length === 0 ? (
              <span className="form-helper">No hay tipos de documento disponibles.</span>
            ) : null}
          </div>

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
              aria-busy={loadingCountries}
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
              aria-busy={loadingDepartments}
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
              aria-busy={loadingCities}
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
