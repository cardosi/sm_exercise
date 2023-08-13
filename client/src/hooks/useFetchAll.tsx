import { useState } from 'react';
import { ItemType, ItemTypeToData } from '../types';

export const useFetchAll = <T extends ItemType>(itemType: T): { data: ItemTypeToData[T], isLoading: boolean, error: string | null, fetchAll: () => void } => {
  const API_URL = import.meta.env.VITE_API_URL

  const [data, setData] = useState<ItemTypeToData[T]>([] as ItemTypeToData[T]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${itemType}`);
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setError(`Error fetching ${itemType}: ${error}`);
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchAll };
};
