import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../../api/users'
import { getCities, getCountries, getDepartments, type City, type Country, type Department } from '../../api/locations'
import { getIdTypes, type IdType } from '../../api/idTypes'

interface CreateUserRequest {
  idType: string
  idNumber: string
  firstName: string
  secondName?: string
  firstSurname: string
  secondSurname?: string
  homeCity: string
  email: string
  mobileNumber: string
}

type FormErrorKey = keyof CreateUserRequest | 'country' | 'department'

interface BackendErrorDetail {
  field?: string
  code?: string
  message?: string
}

interface BackendErrorResponse {
  code?: string
  message?: string
  details?: BackendErrorDetail[]
}

const FORM_ERROR_KEYS: FormErrorKey[] = [
  'idType',
  'idNumber',
  'firstName',
  'secondName',
  'firstSurname',
  'secondSurname',
  'homeCity',
  'email',
  'mobileNumber',
  'country',
  'department',
]

const REQUIRED_MESSAGE = 'Este campo es obligatorio.'
const EMAIL_DUPLICATE_MESSAGE = 'Este correo ya está registrado'
const EMAIL_INVALID_MESSAGE = 'Ingresa un correo electrónico válido.'
const REVIEW_FIELDS_MESSAGE = 'Revisa los campos marcados antes de continuar.'

const isFormErrorKey = (value: string): value is FormErrorKey =>
  FORM_ERROR_KEYS.includes(value as FormErrorKey)

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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormErrorKey, string>>>({})
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
    const fieldName = e.target.name as keyof CreateUserRequest
    const { value } = e.target
    setFormState((state) => ({ ...state, [fieldName]: value }))
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev
      const { [fieldName]: _removed, ...rest } = prev
      return rest
    })
  }

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setFailedRequest(null)
    setSelectedCountry(value)
    setSelectedDepartment('')
    setFieldErrors((prev) => {
      const { country, department, homeCity, ...rest } = prev
      return rest
    })
  }

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setFailedRequest(null)
    setSelectedDepartment(value)
    setFieldErrors((prev) => {
      const { department, homeCity, ...rest } = prev
      return rest
    })
  }

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setLocationsError(null)
    setFailedRequest(null)
    setFormState((state) => ({ ...state, homeCity: value }))
    setFieldErrors((prev) => {
      const { homeCity, ...rest } = prev
      return rest
    })
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
    if (saving) return

    setErr(null)
    setFieldErrors({})

    const sanitized: CreateUserRequest = {
      idType: formState.idType.trim(),
      idNumber: formState.idNumber.trim(),
      firstName: formState.firstName.trim(),
      secondName: formState.secondName?.trim() ?? '',
      firstSurname: formState.firstSurname.trim(),
      secondSurname: formState.secondSurname?.trim() ?? '',
      homeCity: formState.homeCity.trim(),
      email: formState.email.trim(),
      mobileNumber: formState.mobileNumber.trim(),
    }
    const trimmedCountry = selectedCountry.trim()
    const trimmedDepartment = selectedDepartment.trim()

    setFormState(sanitized)
    setSelectedCountry(trimmedCountry)
    setSelectedDepartment(trimmedDepartment)

    const nextErrors: Partial<Record<FormErrorKey, string>> = {}

    if (!sanitized.idType) nextErrors.idType = REQUIRED_MESSAGE
    if (!sanitized.idNumber) nextErrors.idNumber = REQUIRED_MESSAGE
    if (!sanitized.firstName) nextErrors.firstName = REQUIRED_MESSAGE
    if (!sanitized.firstSurname) nextErrors.firstSurname = REQUIRED_MESSAGE
    if (!trimmedCountry) nextErrors.country = REQUIRED_MESSAGE
    if (!trimmedDepartment) nextErrors.department = REQUIRED_MESSAGE
    if (!sanitized.homeCity) nextErrors.homeCity = REQUIRED_MESSAGE
    if (!sanitized.email) {
      nextErrors.email = REQUIRED_MESSAGE
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email)) {
      nextErrors.email = EMAIL_INVALID_MESSAGE
    }
    if (!sanitized.mobileNumber) nextErrors.mobileNumber = REQUIRED_MESSAGE

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setErr(REVIEW_FIELDS_MESSAGE)
      return
    }

    setSaving(true)
    try {
      await createUser(sanitized)
      navigate('/users', { replace: true })
    } catch (error) {
      console.error(error)
      if (isAxiosError(error)) {
        console.error(error.response?.data)
        const backendError = error.response?.data as BackendErrorResponse | undefined
        if (backendError) {
          const backendFieldErrors: Partial<Record<FormErrorKey, string>> = {}
          if (Array.isArray(backendError.details)) {
            backendError.details.forEach((detail) => {
              const field = detail.field
              if (!field) return
              if (field === 'email' && detail.code === 'duplicate') {
                backendFieldErrors.email = EMAIL_DUPLICATE_MESSAGE
                return
              }
              if (isFormErrorKey(field)) {
                backendFieldErrors[field] = detail.message ?? REVIEW_FIELDS_MESSAGE
                return
              }
              if (field in sanitized) {
                backendFieldErrors[field as FormErrorKey] = detail.message ?? REVIEW_FIELDS_MESSAGE
              }
            })
          }

          if (backendError.code === 'UNEXPECTED_ERROR') {
            window.setTimeout(() => {
              window.alert('Ocurrió un error inesperado')
            }, 0)
          }

          if (Object.keys(backendFieldErrors).length > 0) {
            setFieldErrors(backendFieldErrors)
            setErr(REVIEW_FIELDS_MESSAGE)
          } else if (backendError.message) {
            setErr(backendError.message)
          } else {
            setErr('No se pudo crear el usuario. Revisa los permisos y la información ingresada.')
          }
        } else {
          setErr('No se pudo crear el usuario. Revisa los permisos y la información ingresada.')
        }
      } else {
        setErr('No se pudo crear el usuario. Revisa los permisos y la información ingresada.')
      }
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
          <div
            className={`form-control${fieldErrors.idType ? ' form-control--error' : ''}`}
          >
            <label htmlFor="idType">Tipo de identificación*</label>
            <select
              id="idType"
              name="idType"
              value={formState.idType ?? ''}
              onChange={(event) => {
                const value = event.target.value
                setFormState((state) => ({ ...state, idType: value }))
                setFieldErrors((prev) => {
                  const { idType, ...rest } = prev
                  return rest
                })
              }}
              disabled={loadingIdTypes || !!errorIdTypes || idTypes.length === 0}
              aria-label="Selecciona el tipo de documento"
              title="Selecciona el tipo de documento"
              required
              className="input select"
              aria-invalid={Boolean(fieldErrors.idType)}
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
            {fieldErrors.idType ? (
              <span className="form-error">{fieldErrors.idType}</span>
            ) : null}
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

          <label
            className={`form-control${fieldErrors.idNumber ? ' form-control--error' : ''}`}
            htmlFor="idNumber"
          >
            Número de identificación*
            <input
              id="idNumber"
              name="idNumber"
              value={formState.idNumber}
              onChange={onFieldChange}
              placeholder="Ingresa el número"
              autoComplete="off"
              required
              aria-invalid={Boolean(fieldErrors.idNumber)}
            />
            {fieldErrors.idNumber ? (
              <span className="form-error">{fieldErrors.idNumber}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.firstName ? ' form-control--error' : ''}`}
            htmlFor="firstName"
          >
            Primer nombre*
            <input
              id="firstName"
              name="firstName"
              value={formState.firstName}
              onChange={onFieldChange}
              placeholder="Ej. Laura"
              autoComplete="given-name"
              required
              aria-invalid={Boolean(fieldErrors.firstName)}
            />
            {fieldErrors.firstName ? (
              <span className="form-error">{fieldErrors.firstName}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.secondName ? ' form-control--error' : ''}`}
            htmlFor="secondName"
          >
            Segundo nombre
            <input
              id="secondName"
              name="secondName"
              value={formState.secondName ?? ''}
              onChange={onFieldChange}
              placeholder="Opcional"
              autoComplete="given-name"
            />
            {fieldErrors.secondName ? (
              <span className="form-error">{fieldErrors.secondName}</span>
            ) : null}
            <span className="form-helper">Este campo es opcional.</span>
          </label>

          <label
            className={`form-control${fieldErrors.firstSurname ? ' form-control--error' : ''}`}
            htmlFor="firstSurname"
          >
            Primer apellido*
            <input
              id="firstSurname"
              name="firstSurname"
              value={formState.firstSurname}
              onChange={onFieldChange}
              placeholder="Ej. González"
              autoComplete="family-name"
              required
              aria-invalid={Boolean(fieldErrors.firstSurname)}
            />
            {fieldErrors.firstSurname ? (
              <span className="form-error">{fieldErrors.firstSurname}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.secondSurname ? ' form-control--error' : ''}`}
            htmlFor="secondSurname"
          >
            Segundo apellido
            <input
              id="secondSurname"
              name="secondSurname"
              value={formState.secondSurname ?? ''}
              onChange={onFieldChange}
              placeholder="Opcional"
              autoComplete="family-name"
            />
            {fieldErrors.secondSurname ? (
              <span className="form-error">{fieldErrors.secondSurname}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.country ? ' form-control--error' : ''}`}
            htmlFor="country"
          >
            País*
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={loadingCountries || countries.length === 0}
              aria-busy={loadingCountries}
              required
              aria-invalid={Boolean(fieldErrors.country)}
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
            {fieldErrors.country ? (
              <span className="form-error">{fieldErrors.country}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.department ? ' form-control--error' : ''}`}
            htmlFor="department"
          >
            Departamento*
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              disabled={!selectedCountry || loadingDepartments || departments.length === 0}
              aria-busy={loadingDepartments}
              required
              aria-invalid={Boolean(fieldErrors.department)}
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
            {fieldErrors.department ? (
              <span className="form-error">{fieldErrors.department}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.homeCity ? ' form-control--error' : ''}`}
            htmlFor="homeCity"
          >
            Ciudad*
            <select
              id="homeCity"
              value={formState.homeCity}
              onChange={handleCityChange}
              disabled={!selectedDepartment || loadingCities || cities.length === 0}
              aria-busy={loadingCities}
              required
              aria-invalid={Boolean(fieldErrors.homeCity)}
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
            {fieldErrors.homeCity ? (
              <span className="form-error">{fieldErrors.homeCity}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.email ? ' form-control--error' : ''}`}
            htmlFor="email"
          >
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
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email ? (
              <span className="form-error">{fieldErrors.email}</span>
            ) : null}
          </label>

          <label
            className={`form-control${fieldErrors.mobileNumber ? ' form-control--error' : ''}`}
            htmlFor="mobileNumber"
          >
            Teléfono móvil*
            <input
              id="mobileNumber"
              name="mobileNumber"
              value={formState.mobileNumber}
              onChange={onFieldChange}
              placeholder="Ej. 3001234567"
              autoComplete="tel"
              required
              aria-invalid={Boolean(fieldErrors.mobileNumber)}
            />
            {fieldErrors.mobileNumber ? (
              <span className="form-error">{fieldErrors.mobileNumber}</span>
            ) : null}
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
