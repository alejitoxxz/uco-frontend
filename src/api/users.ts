import api from './apiClient'

export interface UserSummary {
  id: string
  firstName: string
  lastName?: string | null
  email: string
  mobileNumber?: string | null
  emailConfirmed?: boolean | null
  mobileNumberConfirmed?: boolean | null
}

export interface UsersPage {
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

const API_PREFIX = '/uco-challenge/api/v1'
const LIST_URL = `${API_PREFIX}/users` // GET lista
const CREATE_URL = `${API_PREFIX}` // POST crear (sin /users por el controller actual)

export async function getUsers(params: { page: number; size: number }): Promise<UsersPage> {
  const { page, size } = params
  const { data } = await api.get<UsersPage>(LIST_URL, { params: { page, size } })
  return data
}

export async function confirmUserEmail(id: string): Promise<void> {
  await api.post(`${LIST_URL}/${id}/confirm-email`)
}

export async function confirmUserMobile(id: string): Promise<void> {
  await api.post(`${LIST_URL}/${id}/confirm-mobile`)
}

export const createUser = async (payload: CreateUserRequest) => {
  const { data } = await api.post(CREATE_URL, payload)
  return data
}
