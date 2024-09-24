import React, { useEffect, useCallback, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import { useGameService } from '../../context/gameServiceContext';

function EnvironmentDropdown() {
  const { setURL, persistentState } = useGameService();
  const { baseURL } = persistentState;
  const [imagesFetched, setImagesFetched] = useState(false);

  const heatmapURL =
    'https://us-central1-stemuli-game.cloudfunctions.net/generate_heatmap_function/';

  const resetHeatmaps = () => {
    const event = new StorageEvent('storage', {
      key: `reset_heatmaps`,
    });

    window.dispatchEvent(event);
  };

  const failedHeatmap = () => {
    resetHeatmaps();

    const event = new StorageEvent('storage', {
      key: `failed_heatmap`,
    });

    window.dispatchEvent(event);
  };

  const fetchImage = useCallback(async () => {
    resetHeatmaps();

    try {
      const levelNames = ['SUBWAY_STATION', 'TUTORIAL_TRAIN'];
      const fetchPromises = levelNames.map(async (levelName) => {
        let url = `${heatmapURL}generate_heatmap?level_name=${levelName}&access_token=${localStorage.getItem('token')}`;

        switch (localStorage.getItem('baseURL')) {
          case import.meta.env.VITE_PRODUCTION_GAME_SERVICE_BASE_URL:
            url += '&environment=prod';
            break;
          case import.meta.env.VITE_PROJECT_GAME_SERVICE_BASE_URL:
            url += '&environment=proj';
            break;
          case import.meta.env.VITE_DEVELOP_GAME_SERVICE_BASE_URL:
            url += '&environment=dev';
            break;
          default:
            url += '&environment=proj';
            break;
        }

        if (localStorage.getItem('userType') === 'teacher') {
          url += '&all_students=true';
        }

        console.log(`Fetching image from: ${url}`);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`Network response was not ok for ${levelName}`);
        const imageBlob = await response.blob();
        const localUrl = URL.createObjectURL(imageBlob);
        console.log(`Fetched image for ${levelName}: ${localUrl}`);
        localStorage.setItem(`${levelName}_heatmap`, localUrl);

        const event = new StorageEvent('storage', {
          key: `${levelName}_heatmap`,
          newValue: localUrl,
        });

        window.dispatchEvent(event);
      });
      await Promise.all(fetchPromises);
    } catch (error) {
      console.error('Error fetching image:', error);
      failedHeatmap();
    }
  }, [baseURL, imagesFetched]);

  const handleChange = (event) => {
    setURL(event.target.value);
    fetchImage().then((r) => console.log('Image fetched'));
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
          <MenuItem value={import.meta.env.VITE_PRODUCTION_GAME_SERVICE_BASE_URL}>
            Production
          </MenuItem>
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
