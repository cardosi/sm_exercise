import { useState } from 'react';
import { ItemType } from '../types';

export const useManageItem = (itemType: ItemType) => {
  const API_URL = import.meta.env.VITE_API_URL

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const generateId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const createItem = async (item: object) => {
    setIsLoading(true);
    try {
      const id = generateId();
      await fetch(`${API_URL}/${itemType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...item }),
      });
      setIsLoading(false);
    } catch (error) {
      setError(`Error creating new ${itemType}: ${error}`);
      setIsLoading(false);
    }
  };

  const updateItem = async (id: number, name: string) => {
    if (itemType === 'pizza_toppings') {
      setError(`Error updating ${itemType}: Cannot update pizza toppings`);
      return;
    }
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/${itemType}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      setIsLoading(false);
    } catch (error) {
      setError(`Error updating ${itemType}: ${error}`);
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: number, pizzaToppingIDs: number[]) => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/${itemType}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({ pizza_topping_ids: pizzaToppingIDs }),
      });
      setIsLoading(false);
    } catch (error) {
      setError(`Error deleting ${itemType}: ${error}`);
      setIsLoading(false);
    }
  };

  return { isLoading, error, createItem, updateItem, deleteItem };
};
