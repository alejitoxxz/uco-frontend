import api from './apiClient'

export interface IdType {
  id: string
  name: string
}

export async function getIdTypes(): Promise<IdType[]> {
  const { data } = await api.get<IdType[]>('/users/uco-challenge/api/v1/id-types')
  return data
}
