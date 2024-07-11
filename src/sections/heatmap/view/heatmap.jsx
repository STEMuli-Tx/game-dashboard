import React, { useState, useEffect } from 'react';
import { Container, Typography, Slider } from '@mui/material';
import { useGameService } from 'src/context/gameServiceContext';
import trainHeatmap from '/src/components/images/subway_train_heatmap.png';
import stationHeatmap from '/src/components/images/subway_station_heatmap.png';
import trainImage from '/src/components/images/subway_train_map.png';
import stationImage from '/src/components/images/subway_station_map.png';


export default function HeatMapPage() {
  const { getStudents, getNavigatorObjectiveDetails, markLearningObjectivesComplete } =
    useGameService();
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1); // Default opacity is 1

  const handleOpacityChange = (event, newValue) => {
    setOverlayOpacity(newValue);
  };

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
    <Container className="container-center">
      <Typography variant="h3" mb={5}>
        Heat Map
      </Typography>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="slider-container" style={{ marginRight: '20px' }}>
          <Slider
            aria-label="Overlay Opacity"
            defaultValue={1}
            step={0.01}
            min={0}
            max={1}
            valueLabelDisplay="auto"
            onChange={handleOpacityChange}
            orientation="vertical"
            sx={{ height: 300 }} // Adjust the height as needed
          />
          <Typography>
            Heat Map Alpha
          </Typography>
        </div>

        <div className="image-container">
          <div className="image-pair">
            <div className="image-title-container">
              <Typography className="image-title">Station Map</Typography>
              <img src={stationImage} alt="SubwayTrainMap" className="background-image" />
              <img src={stationHeatmap} alt="SubwayTrainMap" className="overlay-image"
                   style={{ opacity: overlayOpacity }} />
            </div>
          </div>
          <div className="image-pair">
            <div className="image-title-container">
              <Typography className="image-title">Train Map</Typography>
              <img src={trainImage} alt="SubwayTrainMap" className="background-image" />
              <img src={trainHeatmap} alt="SubwayTrainMap" className="overlay-image"
                   style={{ opacity: overlayOpacity }} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
