import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { DataProvider } from '@/store/DataContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PageLoader } from '@/components/ui/PageLoader';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Earthquakes = lazy(() => import('@/pages/Earthquakes'));
const Wildfires = lazy(() => import('@/pages/Wildfires'));
const NaturalEvents = lazy(() => import('@/pages/NaturalEvents'));
const SatelliteExplorer = lazy(() => import('@/pages/SatelliteExplorer'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const About = lazy(() => import('@/pages/About'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DataProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="earthquakes"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Earthquakes />
                  </Suspense>
                }
              />
              <Route
                path="wildfires"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Wildfires />
                  </Suspense>
                }
              />
              <Route
                path="natural-events"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <NaturalEvents />
                  </Suspense>
                }
              />
              <Route
                path="satellite"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SatelliteExplorer />
                  </Suspense>
                }
              />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Analytics />
                  </Suspense>
                }
              />
              <Route
                path="about"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </DataProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
