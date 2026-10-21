import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { DataProvider } from '@/store/DataContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { PageLoader } from '@/components/ui/PageLoader';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const WorldMapPage = lazy(() => import('@/pages/WorldMapPage'));
const Earthquakes = lazy(() => import('@/pages/Earthquakes'));
const Wildfires = lazy(() => import('@/pages/Wildfires'));
const NaturalEvents = lazy(() => import('@/pages/NaturalEvents'));
const SatelliteExplorer = lazy(() => import('@/pages/SatelliteExplorer'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const About = lazy(() => import('@/pages/About'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider>
          <DataProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={withSuspense(<Dashboard />)} />
                <Route path="map" element={withSuspense(<WorldMapPage />)} />
                <Route path="earthquakes" element={withSuspense(<Earthquakes />)} />
                <Route path="wildfires" element={withSuspense(<Wildfires />)} />
                <Route path="natural-events" element={withSuspense(<NaturalEvents />)} />
                <Route path="satellite" element={withSuspense(<SatelliteExplorer />)} />
                <Route path="analytics" element={withSuspense(<Analytics />)} />
                <Route path="about" element={withSuspense(<About />)} />
                <Route path="*" element={withSuspense(<NotFound />)} />
              </Route>
            </Routes>
          </DataProvider>
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
