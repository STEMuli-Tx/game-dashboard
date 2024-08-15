import { Helmet } from 'react-helmet-async';

import { AllHeatMapView } from 'src/sections/all-heatmap/view';
import React from 'react';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Combined Heat Map </title>
      </Helmet>
      
      <AllHeatMapView />
    </>
  );
}