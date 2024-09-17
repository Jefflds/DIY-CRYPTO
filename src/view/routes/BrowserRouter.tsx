import { Suspense } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { Loader } from '../components/Loader';
import { Page } from '../screens/Page';

export function BrowserRouter() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/pt" />} />
          <Route path="/:lang" element={<Page />} />
        </Routes>
      </Suspense>
    </Router>
  );
}