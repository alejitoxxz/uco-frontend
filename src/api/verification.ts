import { api } from './client'

export async function verifyContactCode(contact: string, code: string): Promise<void> {
  await api.post('/uco-challenge/api/v1/users/verify-code', null, {
    params: { contact, code },
  })
}
