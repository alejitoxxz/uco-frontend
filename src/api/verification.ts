import { apiClient } from './client'

export async function sendVerificationCode(userId: string, channel: 'email' | 'mobile') {
  return apiClient.post(`/uco-challenge/api/v1/users/${userId}/send-code`, null, {
    params: { channel },
  })
}

export async function verifyContactCode(contact: string, code: string): Promise<void> {
  await apiClient.post('/users/verify-code', null, {
    params: { contact, code },
  })
}
