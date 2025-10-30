import api from './apiClient';

export interface PagedUsers {
  users: { id: string; firstName: string; lastName: string; email: string }[];
  page: number; size: number; totalElements: number;
}

export interface CreateUserRequest {
  idType: string;
  idNumber: string;
  firstName: string;
  secondName?: string;
  firstSurname: string;
  secondSurname?: string;
  homeCity: string;
  email: string;
  mobileNumber: string;
}

const BASE = '/users/uco-challenge/api/v1';   // vía gateway
const LIST_URL = `${BASE}/users`;             // GET lista
const CREATE_URL = `${BASE}`;                 // POST crear (sin /users por el controller actual)

export const getUsers = async (page = 0, size = 10): Promise<PagedUsers> => {
  const { data } = await api.get<PagedUsers>(LIST_URL, { params: { page, size } });
  return data;
};

export const createUser = async (payload: CreateUserRequest) => {
  const { data } = await api.post(CREATE_URL, payload);
  return data;
};
