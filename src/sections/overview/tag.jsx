import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useGameService } from '../../context/gameServiceContext';

export default function Tag({ url, tags, setTags }) {
  const { getTags } = useGameService();

  useEffect(() => {
    fetchTags();
  }, [url]);

  const fetchTags = async () => {
    const response = await getTags();
    setTags(response.data);
  };

  return (
    <Stack direction="row" spacing={1}>
      <h3>Tags for Account</h3>
      {tags.map((tag) => {
        return <Chip key={tag._id} label={tag.title} color="success" />;
      })}
    </Stack>
  );
}

// Define prop types
Tag.propTypes = {
  url: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  setTags: PropTypes.func.isRequired,
};
