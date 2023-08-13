import { TextField, IconButton } from "@mui/material";
import { ChangeEvent, FC } from "react";
import AddIcon from '@mui/icons-material/Add';

interface CreateInputProps {
  label: string;
  value: string;
  placeholder?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

export const CreateInput: FC<CreateInputProps> = ({ label, value, placeholder, handleChange, handleClick }) => {
  const CreateButton = () => {
    return (
      <IconButton
        aria-label="edit"
        color="success"
        onClick={handleClick}
        disabled={value === ''}
      >
        <AddIcon />
      </IconButton>
    )
  }
  return (
    <TextField
      color="success"
      variant="outlined"
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      InputProps={{ endAdornment: <CreateButton /> }}
    />
  );
}
