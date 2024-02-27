import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useGameService } from '../../context/gameServiceContext';
import PropTypes from 'prop-types';

export default function SyncQuests({ fetchQuests }) {
  const { syncQuest } = useGameService();

  const handleQuestSync = async () => {
    // handle reset action for the item with the given id
    await syncQuest();
    fetchQuests();
  };

  return (
    <Button
      variant="contained"
      color="primary" // MUI v5 color prop supports 'error' for red
      // startIcon={<DeleteForeverIcon />}
      onClick={handleQuestSync}
    >
      Sync Quests
    </Button>
  );
}
SyncQuests.propTypes = {
  fetchQuests: PropTypes.func,
};
