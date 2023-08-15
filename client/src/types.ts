export interface Topping {
  id: number;
  name: string;
}

export interface Pizza {
  id: number;
  name: string;
}

export interface PizzaTopping {
  id: number;
  pizza_id: number;
  topping_id: number;
}

export type ItemType = 'pizzas' | 'toppings' | 'pizza_toppings';

export type ItemTypeToData = {
  pizzas: Pizza[],
  toppings: Topping[],
  pizza_toppings: PizzaTopping[],
};
