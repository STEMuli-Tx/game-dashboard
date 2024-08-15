import { Helmet } from 'react-helmet-async';

import { UserManagementView } from '../sections/user-management';

// ----------------------------------------------------------------------

export default function AccountManagementPage() {
  return (
    <>
      <Helmet>
        <title> User Management </title>
      </Helmet>

      <UserManagementView />
    </>
  );
}
