import React, { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import ResetQuests from '../reset-quests';
import MarkQuestsComplete from '../mark-quests-complete';
import ResetInventory from '../reset-inventory';
import { useGameService } from '../../../context/gameServiceContext';

// ----------------------------------------------------------------------

export default function AppView() {
  const { getQuests } = useGameService();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    setLoading(true); // Set loading state to true (display loading spinner)
    try {
      const data = await getQuests(); // Fetch the quests

      setQuests(
        data.map((quest) => ({
          id: quest._id,
          name: quest.title,
          status: quest.userQuest.status,
          progress: quest.userQuest.progress,
        }))
      ); // Transform and set the quests data

      setLoading(false); // Set loading state to false (hide loading spinner)
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    }
  };

  const handleResetInventory = (id) => {
    // handle reset action for the item with the given id
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back! 👋
      </Typography>

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

        <Grid xs={12} style={{ textAlign: 'center', marginTop: '20px' }}>
          <ResetInventory />
        </Grid>
      </Grid>
    </Container>
  );
}