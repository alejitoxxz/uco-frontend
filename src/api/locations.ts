import { http } from './apiClient'

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

const BASE = '/api/locations'

export async function getCountries(): Promise<Country[]> {
  const { data } = await http.get<Country[]>(`${BASE}/countries`)
  return data
}

export async function getDepartments(countryId: string): Promise<Department[]> {
  const { data } = await http.get<Department[]>(`${BASE}/countries/${countryId}/departments`)
  return data
}

export async function getCities(departmentId: string): Promise<City[]> {
  const { data } = await http.get<City[]>(`${BASE}/departments/${departmentId}/cities`)
  return data
}
