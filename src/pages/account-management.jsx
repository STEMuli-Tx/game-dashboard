import { Helmet } from 'react-helmet-async';

import { AccountManagementView } from '../sections/account-management';

// ----------------------------------------------------------------------

export default function AccountManagementPage() {
  return (
    <>
      <Helmet>
        <title> Account Management </title>
      </Helmet>

      <AccountManagementView />
    </>
  );
}
