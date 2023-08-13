import { FC, useEffect, useState } from "react";
import { PizzaTopping } from "../types";
import { Switch } from "@mui/material";

interface PizzaToppingSwitchProps {
  pizzaToppingData: PizzaTopping[];
  toppingId: number;
  selectedPizzaId: number | null;
  addPizzaTopping: ({ pizza_id, topping_id }: { pizza_id: number, topping_id: number }) => void;
  removePizzaTopping: (pizzaToppingId: number, _: number[]) => void;
}

export const PizzaToppingSwitch: FC<PizzaToppingSwitchProps> = ({ pizzaToppingData, toppingId, selectedPizzaId, addPizzaTopping, removePizzaTopping }) => {
  const [pizzaTopping, setPizzaTopping] = useState<PizzaTopping | null>(null);

  useEffect(() => {
    setPizzaTopping(pizzaToppingData.find(pizzaTopping => pizzaTopping.topping_id === toppingId && pizzaTopping.pizza_id === selectedPizzaId) || null)
  }, [selectedPizzaId, pizzaToppingData])

  const handleChange = () => {
    if (!selectedPizzaId) return;
    if (pizzaTopping) {
      removePizzaTopping(pizzaTopping.id, [])
    } else {
      addPizzaTopping({ pizza_id: selectedPizzaId, topping_id: toppingId })
    }
  }

  return (
    <Switch
      key={toppingId}
      checked={pizzaTopping ? true : false}
      onChange={handleChange}
    />
  )
}

