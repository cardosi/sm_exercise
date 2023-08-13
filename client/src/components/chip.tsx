import { Chip } from "@mui/material";
import { FC } from "react";
import { Pizza, Topping } from "../types";

interface MuiChipProps {
  item: Topping | Pizza;
  selectedID: number | null;
  handleClick: () => void;
  handleDelete: () => void;
}

export const MuiChip: FC<MuiChipProps> = ({ item, selectedID, handleClick, handleDelete }) => {
  return (
    <Chip
      key={item.id}
      variant={selectedID === item.id ? 'filled' : 'outlined'}
      color="secondary"
      label={item.name}
      onClick={handleClick}
      onDelete={handleDelete}
      sx={{ textTransform: 'capitalize' }}
    />
  );
}