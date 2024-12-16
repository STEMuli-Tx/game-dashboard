import { Helmet } from 'react-helmet-async';

import { PlayfabView } from 'src/sections/playfab/view';

// ----------------------------------------------------------------------

export default function PlayfabPage() {
  return (
    <>
      <Helmet>
        <title> Learning Management </title>
      </Helmet>

      <PlayfabView />
    </>
  );
}
