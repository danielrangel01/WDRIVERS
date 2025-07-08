// components/AlertaGlobal.jsx
import { Alert, Snackbar } from '@mui/material';

function AlertaGlobal({ open, onClose, message, severity = "info" }) {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert variant="filled" severity={severity} sx={{ width: '100%' }} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertaGlobal;
