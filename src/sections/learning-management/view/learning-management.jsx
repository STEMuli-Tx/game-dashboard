import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import { useGameService } from 'src/context/gameServiceContext';

export default function LearningManagementPage() {
  const { getStudents, getNavigatorObjectiveDetails, markLearningObjectivesComplete } =
    useGameService();
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Fetching students');
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentsData = await getStudents();
      const activitiesData = await getNavigatorObjectiveDetails();

      setStudents(studentsData.data); // Assuming the API response format
      setActivities(activitiesData.data); // Assuming the API response format
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const submissionData = {
      userIds: selectedUsers.map((user) => user.userId),
      objectiveIds: selectedActivities.map((activity) => activity.objective),
    };

    try {
      await markLearningObjectivesComplete(submissionData);
      // Handle success response
    } catch (error) {
      console.error('Submission failed:', error);
      // Handle error response
    }
  };

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        Learning Management System
      </Typography>

      <Box mb={3}>
        <Autocomplete
          multiple
          id="users-autocomplete"
          options={students}
          getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="Who?" placeholder="Select Users" />
          )}
          sx={{ width: 800 }}
        />
      </Box>

      <Box mb={3}>
        <Autocomplete
          multiple
          id="activities-autocomplete"
          options={activities}
          getOptionLabel={(option) => option.title}
          onChange={(event, newValue) => {
            setSelectedActivities(newValue);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Completed What Activity on D2L?"
              placeholder="Select Activities"
            />
          )}
          sx={{ width: 300 }}
        />
      </Box>

      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit
      </Button>
    </Container>
  );
}
