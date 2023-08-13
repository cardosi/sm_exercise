import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import { FC } from 'react';
import { Alert } from '@mui/material';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

interface MUIAlertProps {
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const MUIAlert: FC<MUIAlertProps> = ({ message, open, setOpen }) => {
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}