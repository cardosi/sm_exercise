import { Box, Grid } from "@mui/material"
import { FC } from "react"
import { Pizza, Topping } from "../types"
import { MuiChip } from "./chip"

interface ChipGridProps {
  items: Topping[] | Pizza[]
  selectedID: number | null
  handleDelete: (id: number) => void
  handleSelect: (id: number, name: string) => void
}

export const ChipGrid: FC<ChipGridProps> = ({ items, handleDelete, handleSelect, selectedID }) => {
  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} justifyContent="flex-start" alignItems="flex-start">
        {items.map((item, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <MuiChip
              item={item}
              selectedID={selectedID}
              handleClick={() => handleSelect(item.id, item.name)}
              handleDelete={() => handleDelete(item.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}