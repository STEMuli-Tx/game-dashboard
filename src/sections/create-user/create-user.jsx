// src/sections/create-user/create-user.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';
import { useAuth } from 'src/context/authContext';
import { toast } from 'react-toastify';
import StemuliNavigator from 'src/utils/stemuli-navigator';
import DragNDrop from './drag-n-drop';
import RosterTable from './roster-table';

export default function CreateUserView() {
  const { persistentState } = useAuth();
  const [type, setType] = useState('CSV');
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    referenceId: '',
    info: '',
    loginType: '',
  });
  const [files, setFiles] = useState([]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (type === 'CSV') {
      try {
        await Promise.all(
          files.map(async (file) => {
            await StemuliNavigator.uploadRosterFile(
              persistentState.userId,
              persistentState.tenantId,
              file
            );
            toast.info(`Starting Upload`, {
              theme: 'colored',
            });
          })
        );
        setFiles([]);
      } catch (error) {
        toast.error(`Error uploading`, {
          theme: 'colored',
        });
        console.error(error);
      }
    } else {
      // Handle manual form submission
    }
  };

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        Create User
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select value={type} onChange={handleTypeChange}>
          <MenuItem value="CSV">CSV</MenuItem>
          {/* <MenuItem value="Manual">Manual</MenuItem> */}
        </Select>
      </FormControl>
      {type === 'CSV' ? (
        <form onSubmit={handleSubmit}>
          <DragNDrop setFiles={setFiles} />
          <aside>
            <h4>Files</h4>
            <ul>
              {files.map((file) => (
                <li key={file.path}>
                  {file.path} - {file.size} bytes
                </li>
              ))}
            </ul>
          </aside>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Submit
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleInputChange}>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Reference Id"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Info"
                name="info"
                value={formData.info}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Login Type</InputLabel>
                <Select name="loginType" value={formData.loginType} onChange={handleInputChange}>
                  <MenuItem value="Credential">Credential</MenuItem>
                  <MenuItem value="Google">Google</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Submit
          </Button>
        </form>
      )}
      <br />
      <br />
      <br />
      <Typography variant="h6" style={{ margin: '10px' }}>
        Roster Upload Queue
      </Typography>
      <RosterTable />
    </Container>
  );
}
