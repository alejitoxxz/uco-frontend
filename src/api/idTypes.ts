import { http } from './apiClient'

export interface IdType {
  id: string
  name: string
}

const ID_TYPES_URL = '/api/idtypes'

export async function getIdTypes(): Promise<IdType[]> {
  const { data } = await http.get<IdType[]>(ID_TYPES_URL)
  return data
}
