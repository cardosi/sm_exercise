import { FC } from "react";
import { PizzaToppingSwitch } from "./pizzaToppingSwitch";
import { FormControlLabel } from "@mui/material";
import { formattedName } from "../utils";

interface ToppingListProps {
  toppingsData: { id: number; name: string; }[];
  pizzaToppingData: { id: number; pizza_id: number; topping_id: number; }[];
  selectedPizza: { id: number | null; name: string; };
  createPizzaTopping: ({ pizza_id, topping_id }: { pizza_id: number; topping_id: number }) => void;
  deletePizzaTopping: (pizzaToppingId: number, _: number[]) => void;
}

export const ToppingList: FC<ToppingListProps> = ({ toppingsData, pizzaToppingData, selectedPizza, createPizzaTopping, deletePizzaTopping }) => {

  return (
    <>
      {toppingsData.map((topping) => (
        <FormControlLabel
          key={topping.id}
          label={formattedName(topping.name)}
          labelPlacement="start"
          control={
            <PizzaToppingSwitch
              pizzaToppingData={pizzaToppingData}
              selectedPizzaId={selectedPizza.id}
              toppingId={topping.id}
              addPizzaTopping={createPizzaTopping}
              removePizzaTopping={deletePizzaTopping}
            />
          }
        />
      ))}
    </>
  )
}
