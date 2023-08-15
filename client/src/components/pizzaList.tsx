import { FC } from "react"
import { MuiChip } from "./chip";
import { Pizza } from "../types";

interface PizzaListProps {
  pizzasData: Pizza[];
  selectedPizza: { id: number | null; name: string; };
  handleSelectPizza: (id: number, name: string) => void;
  handleDeletePizza: (id: number) => void;
}

export const PizzaList: FC<PizzaListProps> = ({ pizzasData, selectedPizza, handleSelectPizza, handleDeletePizza }) => {
  return (
    <>
      {pizzasData.map((pizza) => (
        <MuiChip
          key={pizza.id}
          item={pizza}
          selectedID={selectedPizza.id}
          handleClick={() => handleSelectPizza(pizza.id, pizza.name)}
          handleDelete={() => handleDeletePizza(pizza.id)}
        />
      ))}
    </>
  )
}