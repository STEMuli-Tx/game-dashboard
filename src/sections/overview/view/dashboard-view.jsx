import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import ResetQuests from '../reset-quests';
import MarkQuestsComplete from '../mark-quests-complete';
import ResetInventory from '../reset-inventory';
import ResetPlayerLevelData from '../reset-player-level-data';
import MarkKioskObjectivesComplete from '../reset-kiosk-objectives';
import { useGameService } from '../../../context/gameServiceContext';
import ResetRoamingNPC from '../reset-roaming-npc';
import AddAllInventoryItems from '../add-all-inventory-items';
import DeleteTitlePlayer from '../delete-player';
import EnvironmentDropdown from '../environment-dropdown';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function AppView() {
  const { getQuests, getRoamingNPCs, gameService, isReady, setURL, baseURL, urlInit } =
    useGameService();
  const [quests, setQuests] = useState([]);
  const [roamingNPCs, setRoamingNPCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roamingNPCLoading, setRoamingNPCLoading] = useState(true);

  useEffect(() => {
    if (isReady) {
      // setURL(baseURL);
      fetchQuests();
      fetchRoamingNPCs();
      // Call other functions that depend on gameService being initialized
    }
  }, []);

  useEffect(() => {
    if (urlInit) {
      fetchQuests();
      fetchRoamingNPCs();
    }
  }, [baseURL, urlInit]);

  const fetchQuests = async () => {
    setLoading(true); // Set loading state to true (display loading spinner)
    try {
      const data = await getQuests(); // Fetch the quests

      if (Array.isArray(data))
        setQuests(
          data.map((quest) => ({
            id: quest._id,
            name: quest.title,
            status: quest.userQuest ? quest.userQuest.status : "userQuest doesn't exist",
            progress: quest.userQuest ? quest.userQuest.progress : "userQuest doesn't exist",
          }))
        );
      else
        setQuests(
          data.data.map((quest) => ({
            id: quest._id,
            name: quest.title,
            status: quest.userQuest ? quest.userQuest.status : "userQuest doesn't exist",
            progress: quest.userQuest ? quest.userQuest.progress : "userQuest doesn't exist",
          }))
        );

      setLoading(false); // Set loading state to false (hide loading spinner)
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    }
  };

  const fetchRoamingNPCs = async () => {
    setRoamingNPCLoading(true); // Set loading state to true (display loading spinner)
    try {
      const data = await getRoamingNPCs(); // Fetch the quests

      setRoamingNPCs(
        data.map((i) => ({
          id: i._id,
          gameObjectId: i.gameObjectId,
        }))
      ); // Transform and set the quests data

      setRoamingNPCLoading(false); // Set loading state to false (hide loading spinner)
    } catch (error) {
      console.error('Failed to fetch roaming NPCs:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid item xs={6} md={6} lg={6}>
        <EnvironmentDropdown />
      </Grid>
      <br />
      <br />
      <Grid item xs={12}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>
          🗻 Quests
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={6} style={{ maxHeight: '500px', overflow: 'auto' }}>
          <ResetQuests
            fetchQuests={fetchQuests}
            title="🧨 Reset Quests"
            list={quests} // Pass the quests data to AppTasks
            isLoading={loading}
          />
        </Grid>

        <Grid xs={12} sm={6} md={6} style={{ maxHeight: '500px', overflow: 'auto' }}>
          <MarkQuestsComplete
            fetchQuests={fetchQuests}
            title="✅ Mark Complete"
            list={quests} // Pass the quests data to AppTasks
            isLoading={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" style={{ marginBottom: '20px' }}>
            🦜 Roaming NPC
          </Typography>
        </Grid>
        <Grid xs={12} sm={6} md={6} style={{ maxHeight: '500px', overflow: 'auto' }}>
          <ResetRoamingNPC
            fetchRoamingNPCs={fetchRoamingNPCs}
            title="🧨 Reset Roaming NPC"
            list={roamingNPCs} // Pass the quests data to AppTasks
            isLoading={roamingNPCLoading}
          />
        </Grid>

        {/* Adjustments for SyncQuests, ResetInventory, and ResetPlayerLevelData */}
        <Grid item container xs={12} spacing={3} style={{ textAlign: 'center', marginTop: '20px' }}>
          <Grid item xs={4}>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Add all Inventory Items to Player
            </Typography>
            <AddAllInventoryItems />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Delete Player Title from Playfab
            </Typography>
            <DeleteTitlePlayer />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" style={{ marginBottom: '10px' }}>
              Clears out the picked up items in the level so the player can pick them up again
            </Typography>
            <ResetPlayerLevelData />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
