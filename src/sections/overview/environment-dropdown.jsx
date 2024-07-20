import React, { useContext } from 'react';
import PropTypes from 'prop-types'; // If you decide to use PropTypes
import { useGameService } from '../../context/gameServiceContext';

function EnvironmentDropdown() {
  const { setEnvironment } = useGameService();

  const handleChange = (event) => {

    setEnvironment(event.target.value);
  };

  return (
    <>
      <label htmlFor="environmentSelect">Select Environment:</label>
      <select id="environmentSelect" onChange={handleChange}>
        <option value="https://service-stm.stardevs.xyz/v1">Production</option>
        <option value="https://service-stm-dev.stardevs.xyz/v1">Development</option>
        <option value="https://service-stm-stg.stardevs.xyz/v1">Testing</option>
      </select>
    </>
  );
}

// Optional: Adding PropTypes
EnvironmentDropdown.propTypes = {
  // Define PropTypes if needed
};

export default EnvironmentDropdown;