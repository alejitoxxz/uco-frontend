import { http } from './apiClient'

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

const USERS_BASE = '/api/users'
const CREATE_URL = '/api/users/register'

export async function getUsers(params: { page: number; size: number }): Promise<UsersPage> {
  const { page, size } = params
  const { data } = await http.get<UsersPage>(USERS_BASE, { params: { page, size } })
  return data
}

export async function confirmUserEmail(id: string): Promise<void> {
  await http.post(`${USERS_BASE}/${id}/confirm-email`)
}

export async function confirmUserMobile(id: string): Promise<void> {
  await http.post(`${USERS_BASE}/${id}/confirm-mobile`)
}

export const createUser = async (payload: CreateUserRequest) => {
  const { data } = await http.post(CREATE_URL, payload)
  return data
}
