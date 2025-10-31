import api from './apiClient'

export interface IdType {
  id: string
  name: string
}

const ID_TYPES_URL = '/uco-challenge/api/v1/id-types'

export async function getIdTypes(): Promise<IdType[]> {
  const { data } = await api.get<IdType[]>(ID_TYPES_URL)
  return data
}
