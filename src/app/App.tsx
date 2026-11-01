import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import LoginPage from '../features/auth/LoginPage';
import CompletionPage from '../features/completion/CompletionPage';
import HomePage from '../features/home/HomePage';
import LibraryPage from '../features/library/LibraryPage';
import PlayingPage from '../features/playing/PlayingPage';
import UploadPage from '../features/upload/UploadPage';
import AppLayout from './AppLayout';

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/completion" element={<CompletionPage />} />
            <Route path="/playing" element={<PlayingPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
