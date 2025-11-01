import { api } from './client'

export async function getUsers(page = 0, size = 10) {
  const { data } = await api.get('/users', { params: { page, size } })
  return data
}

export async function createUser(payload: any) {
  try {
    const { data } = await api.post('/users', payload) // endpoint correcto
    return data
  } catch (err: any) {
    console.error('Error creando usuario:', err?.response?.status, err?.response?.data)
    throw err
  }
}
