import React, { useState } from 'react'
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'

interface VerificationModalProps {
  open: boolean // Cambiado de 'show' a 'open'
  contact?: string
  onClose: () => void
  onVerified?: () => void
  onSubmit: (code: string) => void
  title: string
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  open,
  contact,
  onClose,
  onVerified,
  onSubmit,
  title
}) => {
  const [code, setCode] = useState('')

  const handleSubmit = () => {
    console.log('DEBUG: Enviando código:', code)
    onSubmit(code)
    onVerified?.()
    setCode('')
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {contact && (
          <p>Se enviará un código a: {contact}</p>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          variant="contained"
        >
          Verificar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default VerificationModal
