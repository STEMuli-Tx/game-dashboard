import { Helmet } from 'react-helmet-async';

import { QuestView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Quests Dashboard </title>
      </Helmet>

      <QuestView />
    </>
  );
}
