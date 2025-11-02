import { apiClient } from '@/api/client'

export async function sendVerificationCode(userId: string, channel: 'email' | 'mobile') {
  return apiClient.post(`/users/${userId}/send-code`, null, {
    params: { channel },
  })
}

export async function verifyContactCode(contact: string, code: string): Promise<void> {
  await apiClient.post('/users/verify-code', null, {
    params: { contact, code },
  })
}
