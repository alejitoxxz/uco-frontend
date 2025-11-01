import { api } from './client'

export async function getUsers(page = 0, size = 10) {
  const { data } = await api.get('/users', { params: { page, size } })
  return data
}

export async function createUser(payload: any) {
  const { data } = await api.post('/', payload)
  return data
}
