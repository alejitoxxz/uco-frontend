import { api } from './client'

export interface IdType {
  id?: string
  code?: string
  name?: string
  description?: string
}

const ID_TYPES_URL = '/catalogs/id-types'

export async function getIdTypes(): Promise<IdType[]> {
  const { data } = await api.get<IdType[]>(ID_TYPES_URL)
  return data
}
