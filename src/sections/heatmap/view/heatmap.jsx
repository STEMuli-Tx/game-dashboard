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
      resetForm();
      // Handle success response
    } catch (error) {
      console.error('Submission failed:', error);
      // Handle error response
    }
  };

  const resetForm = () => {
    setSelectedUsers([]);
    setSelectedActivities([]);
  };

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        Heatmap
      </Typography>
    </Container>
  );
}
