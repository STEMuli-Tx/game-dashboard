import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user/view';
import InventoryManagementView from '../sections/inventory-management/view/inventory-management.view';

// ----------------------------------------------------------------------

export default function InventoryManagementPage() {
  return (
    <>
      <Helmet>
        <title> Inventory Management </title>
      </Helmet>

      <InventoryManagementView />
    </>
  );
}
