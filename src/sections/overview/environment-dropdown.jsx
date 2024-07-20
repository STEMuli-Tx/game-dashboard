import React, { useContext } from 'react';
import PropTypes from 'prop-types'; // If you decide to use PropTypes
import { useGameService } from '../../context/gameServiceContext';

function EnvironmentDropdown() {
  const { setURL } = useGameService();

  const handleChange = (event) => {
    setURL(event.target.value);
  };

  return (
    <>
      <label htmlFor="environmentSelect">Select Environment:</label>
      <select id="environmentSelect" onChange={handleChange}>
        <option value={import.meta.env.VITE_PROD_GAME_SERVICE_BASE_URL}>Production</option>
        <option value={import.meta.env.VITE_PROJECT_GAME_SERVICE_BASE_URL}>Project</option>
        <option value={import.meta.env.VITE_DEVELOP_GAME_SERVICE_BASE_URL}>Development</option>
      </select>
    </>
  );
}

// Optional: Adding PropTypes
EnvironmentDropdown.propTypes = {
  // Define PropTypes if needed
};

export default EnvironmentDropdown;
