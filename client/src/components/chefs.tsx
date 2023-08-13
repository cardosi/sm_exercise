import { useEffect, useState } from 'react';
import { useFetchAll } from '../hooks/useFetchAll';
import { useManageItem } from '../hooks/useManageItem';
import { Box, Chip, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { CreateInput } from './createInput';
import { MUIAlert } from './alert';
import { MuiChip } from './chip';
import { PizzaToppingSwitch } from './pizzaToppingSwitch';
import { EditableTitle } from './editableTitle';

export const Chefs = () => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectedPizza, setSelectedPizza] = useState<{ id: number | null, name: string }>({ id: null, name: "" });
  const [addPizzaName, setAddPizzaName] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const { data: pizzasData, isLoading: isLoadingPizzas, fetchAll: fetchPizzas } = useFetchAll('pizzas');
  const { data: toppingsData, isLoading: isLoadingToppings, fetchAll: fetchToppings } = useFetchAll('toppings');
  const { data: pizzaToppingData, fetchAll: fetchPizzaToppings } = useFetchAll('pizza_toppings');

  const {
    isLoading: isLoadingManagePizza,
    deleteItem: deletePizza,
    createItem: createPizza,
    updateItem: updatePizza
  } = useManageItem('pizzas');

  const { createItem: createPizzaTopping, deleteItem: deletePizzaTopping, isLoading: isLoadingManagePizzaToppings } = useManageItem('pizza_toppings');


  useEffect(() => {
    fetchToppings();
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (isLoadingManagePizza) return;
    fetchPizzas();
  }, [isLoadingManagePizza]);

  useEffect(() => {
    if (isLoadingManagePizzaToppings) return;
    fetchPizzaToppings();
  }, [isLoadingManagePizzaToppings]);

  const capitalize = (s: string): string => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  const handleCreatePizza = (newPizzaName: string) => {
    const formattedNewPizzaName = newPizzaName.toLowerCase().trim();

    if (pizzasData.some(pizza => pizza.name.toLowerCase().trim() === formattedNewPizzaName)) {
      setAlertMessage(`Pizza ${newPizzaName} already exists!`);
      setAlertOpen(true);
      setAddPizzaName("");
      return;
    }

    createPizza({ name: newPizzaName });
    setAddPizzaName("");
  }

  const handleUpdatePizza = (id: number | null, updatedName: string) => {
    if (id === null) {
      return;
    }
    if (pizzasData.some(pizza => pizza.name.toLowerCase().trim() === updatedName.toLowerCase().trim())) {
      setAlertMessage(`Pizza ${updatedName} already exists!`);
      setAlertOpen(true);
      setSelectedPizza({ id: null, name: "" });
      return;
    }
    updatePizza(id, updatedName);
    setSelectedPizza({ id: null, name: "" });
  }

  const handleSelectPizza = (id: number, name: string) => {
    if (selectedPizza.id === id) {
      setSelectedPizza({ id: null, name: "" });
    }
    else {
      setSelectedPizza({ id, name: capitalize(name) });
    }
  }

  const handleDeletePizza = async (id: number) => {
    if (selectedPizza.id === id) {
      setSelectedPizza({ id: null, name: "" });
    }
    const pizzaToppingsToDelete = pizzaToppingData.filter(pizzaTopping => pizzaTopping.pizza_id === id).map(pizzaTopping => pizzaTopping.id)
    await deletePizza(id, pizzaToppingsToDelete);
    fetchPizzaToppings();
  }


  return (
    <>
      <MUIAlert message={alertMessage} open={alertOpen} setOpen={setAlertOpen} />
      <Box sx={{ display: 'flex', flexDirection: 'row', maxHeight: '80vh' }}>
        <Box sx={{ flex: "1 0 22%", px: 2, borderRight: '1px solid grey', maxHeight: '80vh', overflow: 'hidden' }}>
          <Typography variant="h4" gutterBottom component="span">
            Pizzas
          </Typography>
          <Stack
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
            sx={{ pt: 2, maxHeight: '80vh', overflow: 'scroll' }}
          >
            {isLoadingPizzas && firstLoad ? <div>Loading...</div> : (
              <>
                <CreateInput
                  label="Create A Pizza"
                  value={addPizzaName}
                  handleChange={(e) => setAddPizzaName(e.target.value)}
                  handleClick={() => handleCreatePizza(addPizzaName)}
                />
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
            )}
          </Stack>
        </Box>
        <Box sx={{ flex: "1 0 22%", px: 2, borderRight: '1px solid grey', maxHeight: '80vh', overflow: 'hidden' }}>
          <Typography variant="h4" gutterBottom component="span">
            Toppings
          </Typography>
          <Stack
            justifyContent="flex-start"
            alignItems="flex-end"
            spacing={2}
            sx={{ pt: 2, maxHeight: '80vh', overflow: 'scroll' }}
          >
            {isLoadingToppings && firstLoad ? <div>Loading...</div> : (
              <>
                {toppingsData.map((topping) => (
                  <FormControlLabel
                    key={topping.id}
                    label={topping.name}
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
            )}
          </Stack>
        </Box>
        <Box sx={{ flex: "1 0 56%", px: 2 }}>
          <EditableTitle
            label="Edit Pizza Name"
            helperText={selectedPizza.id === null ? "Select a Pizza to edit" : selectedPizza.name}
            value={selectedPizza.name}
            disabled={selectedPizza.id === null}
            handleChange={(e) => setSelectedPizza({ id: selectedPizza.id, name: e.target.value })}
            handleClick={() => handleUpdatePizza(selectedPizza.id, selectedPizza.name)}
          />
          <Grid container spacing={2} sx={{ pt: 2 }}>
            {pizzaToppingData.map((pizzaTopping) => (
              pizzaTopping.pizza_id === selectedPizza.id && (
                <Grid item key={pizzaTopping.id}>
                  <Chip
                    label={(toppingsData).find(topping => topping.id === pizzaTopping.topping_id)?.name}
                    key={pizzaTopping.id}
                  />
                </Grid>
              )
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
