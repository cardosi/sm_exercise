import { Container, Typography } from '@mui/material'
import { Owners } from './components/owners'
import { UserTabs } from './components/userTabs'
import { ChangeEvent, useState } from 'react';
import { TabPanel } from './components/tabPanel';
import { Chefs } from './components/chefs';

function App() {
  const [value, setValue] = useState(0);

  const handleTabChange = (_: ChangeEvent<object>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container sx={{ height: '100vh', px: 10, pt: 4 }}>
      <Typography variant="h2" gutterBottom component="span">
        SM Slices
      </Typography>
      <UserTabs value={value} handleChange={handleTabChange} />
      <TabPanel value={value} index={0}>
        <Owners />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Chefs />
      </TabPanel>
    </Container>
  )
}

export default App
