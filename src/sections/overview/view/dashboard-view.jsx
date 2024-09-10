import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ResetQuests from '../reset-quests';
import MarkQuestsComplete from '../mark-quests-complete';
import ResetPlayerLevelData from '../reset-player-level-data';
import { useGameService } from '../../../context/gameServiceContext';
import ResetRoamingNPC from '../reset-roaming-npc';
import AddAllInventoryItems from '../add-all-inventory-items';
import DeleteTitlePlayer from '../delete-player';
import EnvironmentDropdown from '../environment-dropdown';
import Tag from '../tag';

// ----------------------------------------------------------------------

export default function AppView() {
  const {
    getQuests,
    getRoamingNPCs,
    gameService,
    isReady,
    setURL,
    persistentState,
    urlInit,
    resetQuests,
  } = useGameService();
  const { baseURL } = persistentState;
  const [quests, setQuests] = useState([]);
  const [roamingNPCs, setRoamingNPCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roamingNPCLoading, setRoamingNPCLoading] = useState(true);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (isReady) {
      // setURL(baseURL);
      fetchQuests();
      fetchRoamingNPCs();
      // Call other functions that depend on gameService being initialized
    }
  }, [tags]);

  useEffect(() => {
    if (urlInit) {
      fetchQuests();
      fetchRoamingNPCs();
    }
  }, [baseURL, urlInit, tags]);

  const fetchQuests = async () => {
    setLoading(true); // Set loading state to true (display loading spinner)
    try {
      const idList = tags.map((x) => x._id);
      const data = await getQuests(idList); // Fetch the quests

      if (Array.isArray(data))
        setQuests(
          data.map((quest) => ({
            id: quest._id,
            name: quest.title,
            status:
              quest.userProgress === 100
                ? 'COMPLETE'
                : quest.userProgress > 0
                  ? 'STARTED'
                  : 'NOT_STARTED',
            progress: quest.userProgress,
          }))
        );
      else
        setQuests(
          data.data.map((quest) => ({
            id: quest._id,
            name: quest.title,
            status:
              quest.userProgress === 100
                ? 'COMPLETE'
                : quest.userProgress > 0
                  ? 'STARTED'
                  : 'NOT_STARTED',
            progress: quest.userProgress,
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
          progress: i.userProgress,
        }))
      ); // Transform and set the quests data

      setRoamingNPCLoading(false); // Set loading state to false (hide loading spinner)
    } catch (error) {
      console.error('Failed to fetch roaming NPCs:', error);
    }
  };

  const resetAndFetchQuests = async (ids) => {
    await resetQuests(ids);
    await fetchQuests();
  };

  return (
    <Container maxWidth="xl">
      <Grid item xs={6} md={6} lg={6}>
        <EnvironmentDropdown />
      </Grid>
      <br />
      <br />
      {/* Adjustments for SyncQuests, ResetInventory, and ResetPlayerLevelData */}
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Player Reset Controls
      </Typography>
      <Grid item container xs={12} spacing={3} style={{ textAlign: 'center', marginTop: '20px' }}>
        <Grid item xs={4}>
          <Typography variant="body2" style={{ marginBottom: '10px' }}>
            Add all Inventory Items to Player
          </Typography>
          <AddAllInventoryItems />
        </Grid>

        <Grid item xs={4}>
          <Typography variant="body2" style={{ marginBottom: '10px' }}>
            Delete Player Title from Playfab (Resets Inventory and FTUE)
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

      <hr />
      <Grid item xs={12}>
        <Typography variant="h5" style={{ marginBottom: '20px' }}>
          🗻 Quests
        </Typography>
      </Grid>

      <Grid item xs={6} md={6} lg={6}>
        <Tag url={baseURL} tags={tags} setTags={setTags} />
      </Grid>
      <br />
      <br />

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={6} style={{ maxHeight: '500px', overflow: 'auto' }}>
          <ResetQuests
            fetchQuests={fetchQuests}
            resetQuests={resetAndFetchQuests}
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
      </Grid>
    </Container>
  );
}
