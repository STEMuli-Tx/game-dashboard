import * as React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Box from '@mui/material/Box';
import { Tab } from '@mui/material';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export default function InventoryManagementView() {
  const [mainTab, setMainTab] = React.useState('1');
  const [subTab, setSubTab] = React.useState('1-1');

  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
    setSubTab(`${newValue}-1`); // Reset subTab when mainTab changes
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Inventory Management</Typography>
      </Stack>

      <Card>
        <TabContext value={mainTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleMainTabChange} aria-label="main tabs">
              <Tab label="Items" value="1" />
              <Tab label="Collectibles" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TabContext value={subTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleSubTabChange} aria-label="items sub tabs">
                  <Tab label="Subcategory 1" value="1-1" />
                  <Tab label="Subcategory 2" value="1-2" />
                </TabList>
              </Box>
              <TabPanel value="1-1">Items Subcategory 1 Content</TabPanel>
              <TabPanel value="1-2">Items Subcategory 2 Content</TabPanel>
            </TabContext>
          </TabPanel>
          <TabPanel value="2">
            <TabContext value={subTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleSubTabChange} aria-label="collectibles sub tabs">
                  <Tab label="Subcategory 1" value="2-1" />
                  <Tab label="Subcategory 2" value="2-2" />
                </TabList>
              </Box>
              <TabPanel value="2-1">Collectibles Subcategory 1 Content</TabPanel>
              <TabPanel value="2-2">Collectibles Subcategory 2 Content</TabPanel>
            </TabContext>
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
}
