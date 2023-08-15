import { useEffect, useState } from 'react';
import { useFetchAll } from '../hooks/useFetchAll';
import { useManageItem } from '../hooks/useManageItem';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import { CreateInput } from './createInput';
import { MUIAlert } from './alert';
import { EditableTitle } from './editableTitle';
import { PizzaList } from './pizzaList';
import { ToppingList } from './toppingList';
import { formattedName, itemExists } from '../utils';

export const Chefs = () => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [selectedPizza, setSelectedPizza] = useState<{ id: number | null, name: string }>({ id: null, name: "" });
  const [addPizzaName, setAddPizzaName] = useState<string>("");
  const [alert, setAlert] = useState<{ open: boolean, message: string }>({ open: false, message: "" });

  const { data: pizzasData, isLoading: isLoadingPizzas, fetchAll: fetchPizzas } = useFetchAll('pizzas');
  const { data: toppingsData, isLoading: isLoadingToppings, fetchAll: fetchToppings } = useFetchAll('toppings');
  const { data: pizzaToppingData, fetchAll: fetchPizzaToppings } = useFetchAll('pizza_toppings');

  const {
    isLoading: isLoadingManagePizza,
    deleteItem: deletePizza,
    createItem: createPizza,
    updateItem: updatePizza
  } = useManageItem('pizzas');

  const {
    createItem: createPizzaTopping,
    deleteItem: deletePizzaTopping,
    isLoading: isLoadingManagePizzaToppings
  } = useManageItem('pizza_toppings');


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

  const handleCreatePizza = (newPizzaName: string) => {
    if (itemExists(pizzasData, newPizzaName)) {
      setAlert({ open: true, message: `Pizza ${newPizzaName} already exists!` })
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
    if (itemExists(pizzasData, updatedName)) {
      setAlert({ open: true, message: `Pizza ${updatedName} already exists!` })
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
      setSelectedPizza({ id, name: formattedName(name) });
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
      <MUIAlert alert={alert} setAlert={setAlert} />
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '80vh' }}>
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
                <PizzaList
                  pizzasData={pizzasData}
                  selectedPizza={selectedPizza}
                  handleSelectPizza={handleSelectPizza}
                  handleDeletePizza={handleDeletePizza}
                />
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
              <ToppingList
                toppingsData={toppingsData}
                pizzaToppingData={pizzaToppingData}
                selectedPizza={selectedPizza}
                deletePizzaTopping={deletePizzaTopping}
                createPizzaTopping={createPizzaTopping}
              />
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
                    data-testid={`pizza-topping-chip-${pizzaTopping.id}`}
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
