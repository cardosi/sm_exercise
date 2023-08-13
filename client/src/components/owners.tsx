import { useEffect, useState } from 'react';
import { useFetchAll } from '../hooks/useFetchAll';
import { useManageItem } from '../hooks/useManageItem';
import { ChipGrid } from './chipGrid';
import { EditInput } from './editInput';
import { Box, Typography } from '@mui/material';
import { CreateInput } from './createInput';
import { MUIAlert } from './alert';

export const Owners = () => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectedTopping, setSelectedTopping] = useState<{ id: number | null, name: string }>({ id: null, name: "" });
  const [addToppingName, setAddToppingName] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const { data: toppingsData, isLoading, fetchAll: fetchToppings } = useFetchAll('toppings');
  const {
    isLoading: isLoadingManage,
    deleteItem: deleteTopping,
    createItem: createTopping,
    updateItem: updateTopping
  } = useManageItem('toppings');
  const { data: pizzaToppingData, fetchAll: fetchPizzaToppings } = useFetchAll('pizza_toppings');


  useEffect(() => {
    if (isLoadingManage) return;
    fetchToppings();
    setFirstLoad(false);
  }, [isLoadingManage]);

  useEffect(() => {
    fetchPizzaToppings();
  }, []);

  const capitalize = (s: string): string => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  const handleCreateTopping = (newToppingName: string) => {
    const formattedNewToppingName = newToppingName.toLowerCase().trim();

    if (toppingsData.some(topping => topping.name.toLowerCase().trim() === formattedNewToppingName)) {
      setAlertMessage(`Topping ${newToppingName} already exists!`);
      setAlertOpen(true);
      setAddToppingName("");
      return;
    }

    createTopping({ name: newToppingName });
    setAddToppingName("");
  }

  const handleUpdateTopping = (id: number | null, updatedName: string) => {
    if (id === null) {
      return;
    }
    if (toppingsData.some(topping => topping.name.toLowerCase().trim() === updatedName.toLowerCase().trim())) {
      setAlertMessage(`Topping ${updatedName} already exists!`);
      setAlertOpen(true);
      setSelectedTopping({ id: null, name: "" });
      return;
    }
    updateTopping(id, updatedName);
    setSelectedTopping({ id: null, name: "" });
  }

  const handleSelectTopping = (id: number, name: string) => {
    if (selectedTopping.id === id) {
      setSelectedTopping({ id: null, name: "" });
    }
    else {
      setSelectedTopping({ id, name: capitalize(name) });
    }
  }

  const handleDeleteTopping = (id: number) => {
    if (selectedTopping.id === id) {
      setSelectedTopping({ id: null, name: "" });
    }
    const pizzaToppingsToDelete = pizzaToppingData.filter(pizzaTopping => pizzaTopping.pizza_id === id).map(pizzaTopping => pizzaTopping.id)
    deleteTopping(id, pizzaToppingsToDelete);
  }

  return (
    <>
      <MUIAlert message={alertMessage} open={alertOpen} setOpen={setAlertOpen} />
      <Typography variant="h4" gutterBottom component="span">
        Available Toppings
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ flex: '2 1 0' }}>
          {isLoading && firstLoad ? <div>Loading...</div> : (
            <ChipGrid
              selectedID={selectedTopping.id}
              items={toppingsData}
              handleDelete={(id) => handleDeleteTopping(id)}
              handleSelect={(id, name) => handleSelectTopping(id, name)}
            />
          )}
        </Box>
        <Box sx={{ flex: '1 1 0' }}>
          <EditInput
            label="Edit A Topping"
            helperText={selectedTopping.id === null ? "Select a topping to edit" : undefined}
            value={selectedTopping.name}
            disabled={selectedTopping.id === null}
            handleChange={(e) => setSelectedTopping({ id: selectedTopping.id, name: e.target.value })}
            handleClick={() => handleUpdateTopping(selectedTopping.id, selectedTopping.name)}
          />
          <Box sx={{ p: 4 }}>
            <CreateInput
              label="Create A Topping"
              value={addToppingName}
              handleChange={(e) => setAddToppingName(e.target.value)}
              handleClick={() => handleCreateTopping(addToppingName)}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
