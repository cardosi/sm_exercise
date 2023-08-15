import { IconButton, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { ChangeEvent, FC, useEffect, useState } from "react";

interface EditableTitleProps {
  label: string;
  value: string;
  helperText?: string;
  disabled: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}


export const EditableTitle: FC<EditableTitleProps> = ({ label, value, helperText, disabled, handleChange, handleClick }) => {
  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    disabled && setEditMode(false)
  }, [disabled])

  const EditButton = () => {
    return (
      <IconButton
        aria-label="edit"
        color="primary"
        onClick={() => setEditMode(true)}
        disabled={disabled}
        data-testid="edit-button"
      >
        <EditIcon />
      </IconButton>
    )
  }

  const CheckButton = () => {
    return (
      <IconButton
        aria-label="submit"
        color="primary"
        onClick={() => {
          handleClick()
          setEditMode(false)
        }}
        disabled={value === ''}
        data-testid="submit-button"
      >
        <CheckIcon />
      </IconButton>
    )
  }
  return (
    <>
      {editMode ? (
        <TextField
          color="info"
          variant="outlined"
          label={label}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          InputProps={{ endAdornment: <CheckButton /> }}
          data-testid="text-field"
        />
      ) : (
        <Typography variant="h4" gutterBottom component="span" data-testid="editable-title-static-text">
          {helperText} {<EditButton />}
        </Typography>
      )}
    </>
  )
}