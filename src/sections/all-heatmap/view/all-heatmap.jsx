import React, { useState, useEffect } from 'react';
import { Container, Typography, Slider } from '@mui/material';
import trainImage from '/src/components/images/subway_train_map.png';
import stationImage from '/src/components/images/subway_station_map.png';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function AllHeatMapPage() {
  const [overlayOpacity, setOverlayOpacity] = useState(1); // Default opacity is 1
  const [stationHeatmapUrl, setStationHeatmapUrl] = useState(() => localStorage.getItem('SUBWAY_STATION_heatmap') || '');
  const [tutorialHeatmapUrl, setTutorialHeatmapUrl] = useState(() => localStorage.getItem('TUTORIAL_TRAIN_heatmap') || '');
  
  const heatmapURL = 'https://us-central1-stemuli-game.cloudfunctions.net/generate_heatmap_function/';

  const handleOpacityChange = (event, newValue) => {
    setOverlayOpacity(newValue);
  };

  useEffect(() => {
    fetchImage();
  }, [stationHeatmapUrl]);
  
  const fetchImage = async () => {
    try {
      const levelNames = [
        'SUBWAY_STATION',
        'TUTORIAL_TRAIN'
      ];

      for (const levelName of levelNames) {
        const url = `${heatmapURL}generate_heatmap?level_name=${levelName}&access_token=${localStorage.getItem('access_token')}&all_students=true`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok for ${levelName}`);

        const imageBlob = await response.blob();
        const localUrl = URL.createObjectURL(imageBlob);

        // Assuming you want to set different localStorage items based on the URL
        localStorage.setItem(`${levelName}_heatmap_combined`, localUrl);
      }
        
    } catch (error) {
      console.error('Error fetching image:', error);
    }
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
        {}
        <div className="image-container">
          <div className="image-pair">
            <div className="image-title-container">
              <Typography className="image-title">Station Map</Typography>
              <img src={stationImage} alt="Subway Station Map" className="background-image" />
              {stationHeatmapUrl ? <img src={stationHeatmapUrl} alt="Subway Station Heatmap" loading="lazy" className="overlay-image"
                               style={{ opacity: overlayOpacity }}/> : <p>Loading...</p>}
            </div>
          </div>
          <div className="image-pair">
            <div className="image-title-container">
              <Typography className="image-title">Train Map</Typography>
              <img src={trainImage} alt="Train Map" className="background-image" />
              {tutorialHeatmapUrl ? <img src={tutorialHeatmapUrl} alt="Tutorial Heatmap" loading="lazy" className="overlay-image"
                                        style={{ opacity: overlayOpacity }}/> : <p>Loading...</p>}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
