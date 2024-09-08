import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useGameService } from '../../context/gameServiceContext';

export default function handleResetPlayerLevelData() {
  const { resetPlayerLevelData } = useGameService();

  const handleOnClick = async () => {
    // handle reset action for the item with the given id
    await resetPlayerLevelData();
  };

  return (
    <Button
      variant="contained"
      color="error" // MUI v5 color prop supports 'error' for red
      // startIcon={<DeleteForeverIcon />}
      onClick={handleOnClick}
    >
      Reset Player Level Data
    </Button>
  );
}
