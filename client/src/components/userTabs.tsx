import { Box, Tab, Tabs } from '@mui/material';
import { FC, ChangeEvent } from 'react';

interface UserTabsProps {
  value: number;
  handleChange: (_: ChangeEvent<object>, newValue: number) => void;
}

export const UserTabs: FC<UserTabsProps> = ({ value, handleChange }) => {
  return (
    <Box sx={{ borderColor: 'divider', width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab label="Owners" value={0} />
        <Tab label="Chefs" value={1} />
      </Tabs>
    </Box >
  );
}
