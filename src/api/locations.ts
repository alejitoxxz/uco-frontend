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

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await api.get<Country[]>(`${BASE}/countries`)
  return data
}

export const getDepartments = async (countryId: string): Promise<Department[]> => {
  const { data } = await api.get<Department[]>(`${BASE}/countries/${countryId}/departments`)
  return data
}

export const getCities = async (departmentId: string): Promise<City[]> => {
  const { data } = await api.get<City[]>(`${BASE}/departments/${departmentId}/cities`)
  return data
}
