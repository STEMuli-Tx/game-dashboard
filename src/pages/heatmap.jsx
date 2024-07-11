import { Helmet } from 'react-helmet-async';

import { HeatMapView } from 'src/sections/heatmap/view';
import React from 'react';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Heat Map </title>
      </Helmet>
      
      <HeatMapView />
    </>
  );
}