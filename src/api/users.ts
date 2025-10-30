import api from './apiClient'

export interface UserSummary {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface PagedUsers {
  users: UserSummary[]
  page: number
  size: number
  totalElements: number
}

export interface CreateUserRequest {
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

const BASE = '/users/uco-challenge/api/v1'
const LIST_URL = `${BASE}/users`
const CREATE_URL = `${BASE}`

export const getUsers = async (page = 0, size = 10): Promise<PagedUsers> => {
  const { data } = await api.get<PagedUsers>(LIST_URL, {
    params: { page, size },
  })

  return data
}

export const createUser = async (payload: CreateUserRequest): Promise<unknown> => {
  const { data } = await api.post(CREATE_URL, payload)
  return data
}
