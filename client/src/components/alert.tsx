import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import { FC } from 'react';
import { Alert } from '@mui/material';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

interface MUIAlertProps {
  alert: { open: boolean; message: string; };
  setAlert: (alert: { open: boolean, message: string }) => void;
}

export const MUIAlert: FC<MUIAlertProps> = ({ alert, setAlert }) => {
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert({ open: false, message: alert.message });
  };

  return (
    <div>
      <Snackbar
        open={alert.open}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}