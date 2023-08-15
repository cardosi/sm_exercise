import { Pizza, Topping } from "./types";

export const formattedName = (name: string): string => {
  return name.trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const itemExists = (itemData: Pizza[] | Topping[], itemName: string): boolean => {
  return itemData.some(item => formattedName(item.name) === formattedName(itemName))
}
