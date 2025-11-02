import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import { verifyContactCode } from '@/api/verification'
import styles from './VerificationModal.module.css'

interface VerificationModalProps {
  open: boolean
  onClose: () => void
  userId: string
  channel: 'email' | 'mobile'
  targetLabel?: string
  onVerified: () => void
}

export default function VerificationModal({
  open,
  onClose,
  userId,
  channel,
  targetLabel,
  onVerified,
}: VerificationModalProps) {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) setCode('')
  }, [open])

  const handleConfirm = async () => {
    if (!/^[0-9]{6}$/.test(code)) return

    try {
      setSubmitting(true)
      await verifyContactCode(userId, channel, code)
      toast.success('Contacto verificado correctamente')
      onClose()
      onVerified()
    } catch (error) {
      toast.error('No se pudo verificar el código. Intenta nuevamente.')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const content = (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.container} role="document">
        <h3 className={styles.title}>Verificar {channel === 'email' ? 'correo' : 'móvil'}</h3>
        <p className={styles.text}>
          Ingresa el código de 6 dígitos enviado a <strong>{targetLabel}</strong>
        </p>

        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, '').slice(0, 6)
            setCode(value)
          }}
          placeholder="000000"
          aria-label="Código de verificación"
        />

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.btnCancel} disabled={submitting}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || !/^[0-9]{6}$/.test(code)}
            className={styles.btnConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
