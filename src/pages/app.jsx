import { Helmet } from 'react-helmet-async';

import { DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>

      <DashboardView />
    </>
  );
}
