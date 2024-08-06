import { useState, useContext } from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import StemuliNavigator from 'src/utils/stemuli-navigator';
import { AuthContext } from 'src/context/authContext';
// ----------------------------------------------------------------------

export default function LoginView() {
  const { signIn, getUser } = useContext(AuthContext);
  const theme = useTheme();

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tenant, setTenant] = useState('STRIDE');
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter password

  const stemuliNavigator = new StemuliNavigator();

  const handleNextClick = async () => {
    // Call the API with the email
    await stemuliNavigator.anonymousLogin();
    setStep(2); // Move to the next step
  };

  const handleLoginClick = async () => {
    const user = await signIn(tenant, email, password);

    if (user) {
      const userType = user.userType;

      if (userType === 'teacher') router.push('/learning-management');
      else router.push('/');
    }
  };

  const handleChange = (event) => {
    stemuliNavigator.setTenant(event.target.value);
    setTenant(event.target.value);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          onChange={(e) => setEmail(e.target.value)}
          disabled={step === 2}
        />

        {step === 2 && (
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
        )}

        {/* <Select */}
        {/*   value={tenant} */}
        {/*   onChange={handleChange} */}
        {/*   displayEmpty */}
        {/*   inputProps={{ 'aria-label': 'Account type' }} */}
        {/*   fullWidth */}
        {/*   sx={{ mt: 1 }} */}
        {/* > */}
        {/*   <MenuItem value="REACH">Reach</MenuItem> */}
        {/*   <MenuItem value="STRIDE">Stride</MenuItem> */}
        {/* </Select> */}
      </Stack>

      {step === 1 ? (
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={handleNextClick}
          sx={{
            mt: 2,
            backgroundColor: '#B360F4',
            '&:hover': {
              backgroundColor: '#a050e0',
            },
          }}
        >
          Next
        </Button>
      ) : (
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleLoginClick}
          sx={{
            mt: 2,
            backgroundColor: '#B360F4',
            '&:hover': {
              backgroundColor: '#a050e0',
            },
          }}
        >
          Login
        </LoadingButton>
      )}
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

          <Divider sx={{ my: 3 }} />

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
