import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import { useGameService } from '../../context/gameServiceContext';

function EnvironmentDropdown() {
  const { setURL, baseURL } = useGameService();

  const handleChange = (event) => {
    setURL(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="environment-select-label">Select Environment</InputLabel>
        <Select
          labelId="environment-select-label"
          id="environmentSelect"
          onChange={handleChange}
          label="Select Environment"
          value={baseURL}
        >
          <MenuItem value={import.meta.env.VITE_PROD_GAME_SERVICE_BASE_URL}>Production</MenuItem>
          <MenuItem value={import.meta.env.VITE_PROJECT_GAME_SERVICE_BASE_URL}>Project</MenuItem>
          <MenuItem value={import.meta.env.VITE_DEVELOP_GAME_SERVICE_BASE_URL}>
            Development
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default EnvironmentDropdown;
