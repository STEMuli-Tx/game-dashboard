import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useGameService } from '../../context/gameServiceContext';
import PropTypes from 'prop-types';

export default function MarkKioskObjectivesComplete() {
  const { markKioskObjectivesComplete } = useGameService();

  const handleClick = async () => {
    // handle reset action for the item with the given id
    await markKioskObjectivesComplete();
  };

  return (
    <Button
      variant="contained"
      color="primary" // MUI v5 color prop supports 'error' for red
      // startIcon={<DeleteForeverIcon />}
      onClick={handleClick}
    >
      Mark LTI Objectives Complete
    </Button>
  );
}
MarkKioskObjectivesComplete.propTypes = {};
