import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useGameService } from 'src/context/gameServiceContext';
import Iconify from 'src/components/iconify';
import { Chip } from '@mui/material';
import './css/explosion.css';
import { useSpring } from 'react-spring';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export default function ResetRoamingNPC({
  title,
  subheader,
  list,
  fetchRoamingNPCs,
  isLoading,
  ...other
}) {
  const { resetRoamingNPCs } = useGameService();
  const [selected, setSelected] = useState([]);

  const [isExploding, setIsExploding] = useState(false);

  const spring = useSpring({
    from: { scale: 1 },
    to: { scale: 10 },
    config: { duration: 500 },
  });

  const handleClickComplete = (taskId) => {
    const tasksCompleted = selected.includes(taskId)
      ? selected.filter((value) => value !== taskId)
      : [...selected, taskId];

    setSelected(tasksCompleted);
  };

  const handleReset = () => {
    setIsExploding(true);
    const explosionElement = document.createElement('div');
    explosionElement.className = 'explosion';
    // Position it dynamically or use static values
    explosionElement.style.top = '50%'; // Example position
    explosionElement.style.left = '50%'; // Example position
    document.body.appendChild(explosionElement);

    resetRoamingNPCs(selected);
    setSelected([]);
    fetchRoamingNPCs();

    // Remove the element after the animation completes
    setTimeout(() => {
      document.body.removeChild(explosionElement);
    }, 500); // Match the duration of the animation
  };

  const handleSelectAll = () => {
    const areAllSelected = list.length > 0 && selected.length === list.length;
    if (areAllSelected) {
      setSelected([]); // Clear selection if all are already selected
    } else {
      setSelected(list.map((task) => task.gameObjectId)); // Select all tasks
    }
  };

  // Check if there are any selected tasks
  const isResetDisabled = selected.length === 0;

  return (
    <Card {...other}>
      {/* <div style={{ transform: spring.scale }}>💥</div> */}
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSelectAll}
              sx={{ mr: 1 }} // Add some right margin
            >
              {selected.length === list.length ? 'Unselect All' : 'Select All'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleReset}
              disabled={isResetDisabled}
            >
              Reset
            </Button>
          </>
        }
      />

      {isLoading ? (
        <Stack spacing={2}>
          {[...new Array(10)].map((item, index) => (
            <Skeleton key={index} animation="wave" variant="rounded" width="100%" height={50} />
          ))}
        </Stack>
      ) : (
        list.map((task) => (
          <TaskItem
            key={task.gameObjectId}
            task={task}
            checked={selected.includes(task.id)}
            onChange={() => handleClickComplete(task.id)}
          />
        ))
      )}
    </Card>
  );
}

ResetRoamingNPC.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
  fetchRoamingNPCs: PropTypes.func,
};

// ----------------------------------------------------------------------

function TaskItem({ task, checked, onChange }) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleMarkComplete = () => {
    handleCloseMenu();
    console.info('MARK COMPLETE', task.id);
  };

  const handleShare = () => {
    handleCloseMenu();
    console.info('SHARE', task.id);
  };

  const handleEdit = () => {
    handleCloseMenu();
    console.info('EDIT', task.id);
  };

  const handleDelete = () => {
    handleCloseMenu();
    console.info('DELETE', task.id);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          pl: 2,
          pr: 1,
          py: 1,
          '&:not(:last-of-type)': {
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          },
          // ...(checked && {
          //   color: 'text.disabled',
          //   textDecoration: 'line-through',
          // }),
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={onChange} />}
          label={task.gameObjectId}
          sx={{ flexGrow: 1, m: 0 }}
        />
        {/* Progress Chip */}
        <Chip
          label={`${task.progress}%`}
          color="secondary" // Example color, adjust based on your task.progress value
          size="small"
          sx={{
            ml: 1, // Add some left margin for spacing
            // Customize the color based on task.progress here
            // Example: backgroundColor: task.progress > 50 ? 'blue' : 'orange',
          }}
        />
      </Stack>
    </>
  );
}

TaskItem.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  task: PropTypes.object,
};
