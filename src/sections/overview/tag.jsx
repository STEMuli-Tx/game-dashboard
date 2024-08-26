import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { useGameService } from '../../context/gameServiceContext';

export default function Tag({ url }) {
  const { getTags } = useGameService();
  const [tags, setTags] = useState([]);
  useEffect(() => {
   const tags = await getTags();
  }, [url]);
  return <div>Some tag</div>;
}

// Define prop types
Tag.propTypes = {
  url: PropTypes.string.isRequired,
};
