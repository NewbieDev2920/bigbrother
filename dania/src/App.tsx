import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';

// Pages
const HomePage = lazy(() => import('@/routes/HomePage'));
const HistoryPage = lazy(() => import('@/routes/HistoryPage'));
const DetailPage = lazy(() => import('@/routes/DetailPage'));
const DashboardPage = lazy(() => import('@/routes/DashboardPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {children}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-canvas">
          <Spinner size={32} />
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/proyecto/:id"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/proyecto/:id/aspecto/:aspecto"
            element={
              <PageTransition>
                <DetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/proyecto/:id/dashboard/:dashboard"
            element={
              <PageTransition>
                <DashboardPage />
              </PageTransition>
            }
          />
          <Route
            path="/historial"
            element={
              <PageTransition>
                <HistoryPage />
              </PageTransition>
            }
          />
          {/* Wildcard to handle any other route by returning home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
