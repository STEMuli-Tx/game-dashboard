import { useState, useContext } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import StemuliNavigator from 'src/utils/stemuli-navigator/stemuli-navigator';

import { bgGradient } from 'src/theme/css';
import { AuthContext } from 'src/context/authContext';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function LoginView() {
  const { signIn, persistentState } = useContext(AuthContext);
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tenant, setTenant] = useState('STRIDE');

  const handleClick = async () => {
    await signIn(tenant, email, password);
  };

  const handleChange = (event) => {
    StemuliNavigator.setTenant(event.target.value);
    setTenant(event.target.value);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={tenant}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Account type' }}
          fullWidth
          sx={{ mt: 1 }}
        >
          <MenuItem value="REACH">Reach</MenuItem>
          <MenuItem value="STRIDE">Stride</MenuItem>
          <MenuItem value="STEMULI">Stemuli</MenuItem>
        </Select>
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleClick}
        sx={{
          mt: 2, // This adds margin-top spacing. '2' is the theme spacing value, adjust as needed.
          backgroundColor: '#B360F4', // This sets the button color to purple.
          '&:hover': {
            backgroundColor: '#a050e0', // Optional: darken the color slightly on hover, adjust as needed.
          },
        }}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Stem City Dashboard</Typography>

          {/* <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography> */}

          {/* <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack> */}

          <Divider sx={{ my: 3 }}>
            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography> */}
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
