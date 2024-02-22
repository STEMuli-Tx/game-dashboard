/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { AuthProvider } from './context/authContext';
import { GameServiceProvider } from './context/gameServiceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <AuthProvider>
      <GameServiceProvider>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </GameServiceProvider>
      <ToastContainer limit={3} />
    </AuthProvider>
  );
}
