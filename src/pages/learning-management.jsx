import { Helmet } from 'react-helmet-async';

import { LearningManagementView } from 'src/sections/learning-management/view';

// ----------------------------------------------------------------------

export default function LearningManagementPage() {
  return (
    <>
      <Helmet>
        <title> Learning Management </title>
      </Helmet>

      <LearningManagementView />
    </>
  );
}
