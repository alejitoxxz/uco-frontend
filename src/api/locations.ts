import { api } from './client'

export interface Country {
  id: string
  name: string
}

export interface Department {
  id: string
  name: string
}

export interface City {
  id: string
  name: string
}

export async function getCountries(): Promise<Country[]> {
  const { data } = await api.get<Country[]>('/catalogs/countries')
  return data
}

export async function getDepartments(countryId: string): Promise<Department[]> {
  const { data } = await api.get<Department[]>('/catalogs/departments', { params: { countryId } })
  return data
}

export async function getCities(departmentId: string): Promise<City[]> {
  const { data } = await api.get<City[]>('/catalogs/cities', { params: { departmentId } })
  return data
}
