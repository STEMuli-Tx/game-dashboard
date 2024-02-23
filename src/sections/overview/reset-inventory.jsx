import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useGameService } from '../../context/gameServiceContext';
import { reset } from 'numeral';

export default function handleResetInventory() {
  const { resetInventory } = useGameService();

  const handleResetInventory = async () => {
    // handle reset action for the item with the given id
    await resetInventory();
  };

  return (
    <Button
      variant="contained"
      color="error" // MUI v5 color prop supports 'error' for red
      // startIcon={<DeleteForeverIcon />}
      onClick={handleResetInventory}
    >
      Reset Inventory
    </Button>
  );
}
