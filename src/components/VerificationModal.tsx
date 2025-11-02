import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { verifyContactCode } from '@/api/verification'

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

  if (!open) return null

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

  return (
    <div role="dialog" aria-modal="true" className="modal-backdrop">
      <div className="modal" role="document">
        <h3>Verificar {channel === 'email' ? 'correo' : 'móvil'}</h3>
        <p>Ingresa el código de 6 dígitos enviado a: {targetLabel}</p>
        <input
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, '').slice(0, 6)
            setCode(value)
          }}
          aria-label="Código de verificación"
        />
        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={submitting}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || !/^[0-9]{6}$/.test(code)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
