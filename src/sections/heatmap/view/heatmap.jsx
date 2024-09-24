import React, { useState, useEffect } from 'react';
import { Container, Typography, Slider } from '@mui/material';
import trainImage from 'src/components/images/subway_train_map.png';
import stationImage from 'src/components/images/subway_station_map.png';
import EnvironmentDropdown from 'src/sections/overview/environment-dropdown';

export default function AllHeatMapPage() {
  const [overlayOpacity, setOverlayOpacity] = useState(1); // Default opacity is 1
  const [stationHeatmapUrl, setStationHeatmapUrl] = useState(
    () => localStorage.getItem('SUBWAY_STATION_heatmap') || ''
  );
  const [tutorialHeatmapUrl, setTutorialHeatmapUrl] = useState(
    () => localStorage.getItem('TUTORIAL_TRAIN_heatmap') || ''
  );
  const [loadingStatus, setLoadingStatus] = useState('loading'); // New state for loading status

  const handleOpacityChange = (event, newValue) => {
    setOverlayOpacity(newValue);
  };

  const handleStorageChange = (event) => {
    console.log('Storage event detected:', event);

    if (event.key === 'SUBWAY_STATION_heatmap') {
      setStationHeatmapUrl(event.newValue || '');
      setLoadingStatus('loaded');
      console.log('Subway Station Heatmap Changed');
    }
    if (event.key === 'TUTORIAL_TRAIN_heatmap') {
      setTutorialHeatmapUrl(event.newValue || '');
      setLoadingStatus('loaded');
      console.log('Tutorial Train Heatmap Changed');
    }
    if (event.key === 'reset_heatmaps') {
      setTutorialHeatmapUrl('');
      setStationHeatmapUrl('');
      setLoadingStatus('loading');
      console.log('Heatmaps Reset');
    }
    if (event.key === 'failed_heatmap') {
      setLoadingStatus('failed');
      console.log('Failed to fetch Heatmap');
    }
  };

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Container className="container-center">
      <EnvironmentDropdown />
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
          <Typography>Heat Map Alpha</Typography>
        </div>
        <div className="image-container">
          <div className="image-pair">
            <div className="image-title-container">
              <Typography className="image-title">Station Map</Typography>
              <img src={stationImage} alt="Subway Station Map" className="background-image" />
              {stationHeatmapUrl ? (
                <img
                  src={stationHeatmapUrl}
                  alt="Subway Station Heatmap"
                  loading="lazy"
                  className="overlay-image"
                  style={{ opacity: overlayOpacity }}
                />
              ) : (
                <p>{loadingStatus === 'failed' ? 'Failed To Load' : 'Loading...'}</p>
              )}
            </div>
          </div>
          <div className="image-pair">
            <div className="image-title-container">
              <Typography className="image-title">Train Map</Typography>
              <img src={trainImage} alt="Train Map" className="background-image" />
              {tutorialHeatmapUrl ? (
                <img
                  src={tutorialHeatmapUrl}
                  alt="Tutorial Heatmap"
                  loading="lazy"
                  className="overlay-image"
                  style={{ opacity: overlayOpacity }}
                />
              ) : (
                <p>{loadingStatus === 'failed' ? 'Failed To Load' : 'Loading...'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
