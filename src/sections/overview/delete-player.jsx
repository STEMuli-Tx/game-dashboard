import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { deletePlayer } from 'src/utils/playfab-service';
import PropTypes from 'prop-types';

export default function DeleteTitlePlayer() {
  const handleClick = async () => {
    // handle reset action for the item with the given id
    await deletePlayer();
  };

  return (
    <Button
      variant="contained"
      color="error" // MUI v5 color prop supports 'error' for red
      // startIcon={<DeleteForeverIcon />}
      onClick={handleClick}
    >
      Delete Title Player
    </Button>
  );
}
DeleteTitlePlayer.propTypes = {};
