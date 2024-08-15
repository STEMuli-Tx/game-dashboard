import { Helmet } from 'react-helmet-async';

import { UserManagementView } from '../sections/user-management';
import { CreateUserView } from '../sections/create-user';

// ----------------------------------------------------------------------

export default function CreateUserPage() {
  return (
    <>
      <Helmet>
        <title> Create User </title>
      </Helmet>

      <CreateUserView />
    </>
  );
}
