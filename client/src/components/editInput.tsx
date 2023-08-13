import { Box, TextField, IconButton } from "@mui/material";
import { ChangeEvent, FC } from "react";
import EditIcon from '@mui/icons-material/Edit';

interface EditInputProps {
  label: string;
  value: string;
  helperText?: string;
  disabled: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

export const EditInput: FC<EditInputProps> = ({ label, value, helperText, disabled, handleChange, handleClick }) => {
  const EditButton = () => {
    return (
      <IconButton
        aria-label="edit"
        color="primary"
        onClick={handleClick}
        disabled={disabled || value === ''}
      >
        <EditIcon />
      </IconButton>
    )
  }
  return (
    <Box sx={{ p: 4 }}>
      <TextField
        color="info"
        variant="outlined"
        label={label}
        value={value}
        helperText={helperText}
        onChange={handleChange}
        disabled={disabled}
        InputProps={{ endAdornment: <EditButton /> }}
      />
    </Box>
  );
}
