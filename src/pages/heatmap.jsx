import { Helmet } from 'react-helmet-async';

import { HeatMapView } from 'src/sections/heatmap/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Inventory </title>
      </Helmet>

      
      
      <HeatMapView />
    </>
  );
}
