import apiClient from './apiClient'

export interface UserSummary {
  id: string
  name: string
  email: string
}

export const getUsers = async (): Promise<UserSummary[]> => {
  const { data } = await apiClient.get<UserSummary[]>('/users')
  return data
}

export const getCurrentUser = async (): Promise<UserSummary> => {
  const { data } = await apiClient.get<UserSummary>('/users/me')
  return data
}
