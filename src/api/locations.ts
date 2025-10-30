import api from './apiClient'

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

const BASE = '/users/uco-challenge/api/v1/locations'

export async function getCountries(): Promise<Country[]> {
  const { data } = await api.get<Country[]>(`${BASE}/countries`)
  return data
}

export async function getDepartments(countryId: string): Promise<Department[]> {
  const { data } = await api.get<Department[]>(`${BASE}/countries/${countryId}/departments`)
  return data
}

export async function getCities(departmentId: string): Promise<City[]> {
  const { data } = await api.get<City[]>(`${BASE}/departments/${departmentId}/cities`)
  return data
}
