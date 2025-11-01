import { useEffect, useMemo, useState } from 'react'
import { verifyContactCode } from '@/api/verification'
import styles from './VerificationModal.module.css'

type ToastLike = {
  success?: (message: string) => void
  error?: (message: string) => void
}

type ToastWindow = Window & { toast?: ToastLike }

interface VerificationModalProps {
  show: boolean
  contact: string
  onClose: () => void
  onVerified: () => void
}

const resolveToast = (): ToastLike | undefined => {
  if (typeof window === 'undefined') return undefined
  const toast = (window as ToastWindow).toast
  if (!toast) return undefined
  return toast
}

const normalizeCode = (value: string) => value.replace(/\D/g, '').slice(0, 6)

const isPhoneContact = (contact: string) => contact.trim().startsWith('+')

const VerificationModal = ({ show, contact, onClose, onVerified }: VerificationModalProps) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!show) {
      setCode('')
      setError(null)
      setLoading(false)
    }
  }, [show])

  useEffect(() => {
    if (!show) return
    setCode('')
    setError(null)
  }, [contact, show])

  const helperMessage = useMemo(() => {
    if (!contact) return ''
    return isPhoneContact(contact)
      ? 'Ingresa el código de 6 dígitos enviado a tu número de teléfono.'
      : 'Ingresa el código de 6 dígitos enviado a tu correo electrónico.'
  }, [contact])

  if (!show) return null

  const handleVerify = async () => {
    setError(null)
    const normalizedCode = code.trim()

    if (!/^\d{6}$/.test(normalizedCode)) {
      setError('El código debe tener 6 dígitos.')
      return
    }

    try {
      setLoading(true)
      await verifyContactCode(contact, normalizedCode)
      const toast = resolveToast()
      if (toast?.success) {
        toast.success('✅ Verificación exitosa')
      } else if (typeof window !== 'undefined') {
        window.alert('✅ Verificación exitosa')
      }
      onVerified()
      onClose()
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } } | null)?.response?.status
      if (status === 401) {
        setError('❌ Código inválido o expirado.')
      } else {
        setError('Error al verificar. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Verificar contacto">
      <div className={`card ${styles.dialog}`}>
        <h2>Verificar contacto</h2>
        <p className={styles.helper}>
          {helperMessage} <span className={styles.highlight}>{contact}</span>
        </p>
        <input
          type="text"
          className={styles.codeInput}
          placeholder="000000"
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => setCode(normalizeCode(event.target.value))}
        />
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verificando…' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationModal
