import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';

import { useGameService } from '../../context/gameServiceContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedTags, theme) {
  return {
    fontWeight: selectedTags.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function Tag({ url }) {
  const { getTags, getAvailableTags, updateUser } = useGameService();
  const [open, setOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    fetchTags();
    fetchAvailableTags();
  }, [url]);

  const fetchTags = async () => {
    const response = await getTags();
    setSelectedTags(response.data.tags);
  };

  const fetchAvailableTags = async () => {
    const response = await getAvailableTags();
    setAvailableTags(response.data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTags = () => {
    setSelectedTags([...selectedTags]);
    const ids = selectedTags.map((tag) => tag._id);
    updateUser({ tags: ids });
    setOpen(false);
  };

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Stack direction="row" spacing={1}>
      <h3>Tags for User</h3>
      {selectedTags.map((tag) => (
        <Chip key={tag._id} label={tag.title} color="success" />
      ))}
      <Button variant="outlined" onClick={handleClickOpen}>
        + Add Tags
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Tags</DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selectedTags}
              onChange={handleSelectChange}
              input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((tag) => (
                    <Chip key={tag._id} label={tag.title} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {availableTags.map((tag) => (
                <MenuItem
                  key={tag._id}
                  value={tag}
                  style={getStyles(tag.title, selectedTags, theme)}
                >
                  {tag.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTags}>Add</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

// Define prop types
Tag.propTypes = {
  url: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  setTags: PropTypes.func.isRequired,
};
