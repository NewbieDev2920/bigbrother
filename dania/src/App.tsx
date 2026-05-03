import { lazy, Suspense, Component, type ReactNode, type ErrorInfo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/Spinner';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Page crashed:', error, info); }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="font-serif text-2xl text-navy-900">Something went wrong</p>
          <pre className="max-w-2xl overflow-auto rounded-xl bg-navy-50 p-4 text-left text-xs text-navy-700">
            {err.message}{'\n\n'}{err.stack}
          </pre>
          <button
            className="rounded-xl bg-navy-900 px-4 py-2 text-sm text-white"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomePage = lazy(() => import('@/routes/HomePage'));
const ProjectPage = lazy(() => import('@/routes/ProjectPage'));
const DetailPage = lazy(() => import('@/routes/DetailPage'));
const HistoryPage = lazy(() => import('@/routes/HistoryPage'));
const DashboardPage = lazy(() => import('@/routes/DashboardPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
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
                <ProjectPage />
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
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
