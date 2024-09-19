import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Tab,
  Card,
  Stack,
  Button,
  Dialog,
  Container,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useApiService } from '../../../context/apiServiceContext';

export default function InventoryManagementView() {
  const {
    getCategories,
    createCategory,
    patchCategory,
    syncFromPlayfab,
    createCatalogItemsToSync,
  } = useApiService();
  const [mainTab, setMainTab] = useState('0');
  const [subTab, setSubTab] = useState('0-0');
  const [categories, setCategories] = useState([]);
  const [currentMainTabCategory, setCurrentMainTabCategory] = useState(null);
  const [currentSubTabCategory, setCurrentSubTabCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('create');
  const [formData, setFormData] = useState({ title: '', sequence: 0, parentId: null, id: null });
  const [playfabDialogOpen, setPlayfabDialogOpen] = useState(false);
  const [playfabIds, setPlayfabIds] = useState('');

  const fetchCategories = async () => {
    const response = await getCategories();
    const categoriesData = response.data;
    setCategories(categoriesData);
    if (categoriesData.length > 0) {
      setCurrentMainTabCategory(categoriesData[0]);
      setMainTab('0');
      if (categoriesData[0].subcategories.length > 0) {
        setCurrentSubTabCategory(categoriesData[0].subcategories[0]);
        setSubTab('0-0');
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
    setSubTab(`${newValue}-0`);
    setCurrentMainTabCategory(categories[newValue]);
    setCurrentSubTabCategory(categories[newValue].subcategories[0]);
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
    const [mainIndex, subIndex] = newValue.split('-');
    setCurrentSubTabCategory(categories[mainIndex].subcategories[subIndex]);
  };

  const handleOpenDialog = (type, category = {}) => {
    setDialogType(type);
    setFormData({
      title: category.title || '',
      sequence: category.sequence || 0,
      parentId: category.parentId || null,
      id: category._id || null,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (dialogType === 'create') {
      await createCategory(formData);
    } else {
      await patchCategory(formData.id, formData);
    }
    fetchCategories();
    handleCloseDialog();
  };

  const handleOpenPlayfabDialog = () => {
    setPlayfabDialogOpen(true);
  };

  const handleClosePlayfabDialog = () => {
    setPlayfabDialogOpen(false);
  };

  const handlePlayfabIdsChange = (e) => {
    const { value } = e.target;
    setPlayfabIds(value);
  };

  const handlePlayfabIdsPaste = (e) => {
    const pasteData = e.clipboardData.getData('text');
    const idsArray = pasteData.split(',').map((id) => id.trim());
    setPlayfabIds((prev) => `${prev}\n${idsArray.join('\n')}`);
    e.preventDefault();
  };

  const handlePlayfabFormSubmit = async () => {
    const idsArray = playfabIds.split('\n').map((id) => ({ playfabId: id.trim() }));
    await createCatalogItemsToSync({ items: idsArray });
    handleClosePlayfabDialog();
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Inventory Management</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => handleOpenDialog('create')}>
            Add Category
          </Button>
          <Button
            onClick={() => handleOpenDialog('update', currentMainTabCategory)}
            aria-label="edit"
          >
            Edit
          </Button>
          <Button variant="contained" onClick={handleOpenPlayfabDialog}>
            Sync from Playfab
          </Button>
        </Stack>
      </Stack>

      <Card>
        <TabContext value={mainTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleMainTabChange} aria-label="main tabs">
              {categories.map((category, index) => (
                <Tab key={category._id} label={category.title} value={`${index}`} />
              ))}
            </TabList>
          </Box>
          {categories.map((category, mainIndex) => (
            <TabPanel key={category._id} value={`${mainIndex}`}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog('create', category._id)}
                  >
                    Add Subcategory
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog('update', currentSubTabCategory)}
                    aria-label="edit-subcategory"
                  >
                    Edit Subcategory
                  </Button>
                </Stack>
              </Stack>
              <TabContext value={subTab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleSubTabChange} aria-label="sub tabs">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <Tab
                        key={subcategory._id}
                        label={subcategory.title}
                        value={`${mainIndex}-${subIndex}`}
                      />
                    ))}
                  </TabList>
                </Box>
                {category.subcategories.map((subcategory, subIndex) => (
                  <TabPanel key={subcategory._id} value={`${mainIndex}-${subIndex}`}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    ></Stack>
                    {subcategory.catalogItemsOnSubCategory.map((item) => (
                      <Typography key={item._id}>{item.Title.NEUTRAL}</Typography>
                    ))}
                  </TabPanel>
                ))}
              </TabContext>
            </TabPanel>
          ))}
        </TabContext>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogType === 'create' ? 'Add Category' : 'Update Category'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="sequence"
            label="Sequence"
            type="number"
            fullWidth
            value={formData.sequence}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleFormSubmit}>{dialogType === 'create' ? 'Add' : 'Update'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={playfabDialogOpen} onClose={handleClosePlayfabDialog}>
        <DialogTitle>Sync from Playfab</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="playfabIds"
            label="Playfab IDs"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={playfabIds}
            onChange={handlePlayfabIdsChange}
            onPaste={handlePlayfabIdsPaste}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePlayfabDialog}>Cancel</Button>
          <Button onClick={handlePlayfabFormSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
