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

export default function ResetQuests({ title, subheader, list, fetchQuests, isLoading, resetQuests, ...other }) {

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

    resetQuests(selected);
    setSelected([]);
    fetchQuests();

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
      setSelected(list.map((task) => task.id)); // Select all tasks
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
            key={task.id}
            task={task}
            checked={selected.includes(task.id)}
            onChange={() => handleClickComplete(task.id)}
          />
        ))
      )}
    </Card>
  );
}

ResetQuests.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
  fetchQuests: PropTypes.func,
};

// ----------------------------------------------------------------------

function TaskItem({ task, checked, onChange }) {
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return { backgroundColor: '#e0e0e0', color: 'black' }; // Grey
      case 'STARTED':
        return { backgroundColor: '#2196f3', color: 'white' }; // Blue
      case 'COMPLETE':
        return { backgroundColor: '#4caf50', color: 'white' }; // Green
      default:
        return { backgroundColor: 'transparent', color: 'black' };
    }
  };
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
          label={task.name}
          sx={{ flexGrow: 1, m: 0 }}
        />
        {/* Status Chip */}
        <Chip
          label={task.status}
          color="primary" // Example color, adjust based on your task.status value
          size="small"
          sx={{
            ml: 1,
            ...getStatusChipColor(task.status),
          }}
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
