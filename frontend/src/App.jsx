import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Publications from "./pages/Publications";
import Loader from "./components/Loader";

const DirectorDashboard = lazy(() => import("./pages/dashboards/DirectorDashboard"));
const AdvisorDashboard = lazy(() => import("./pages/dashboards/AdvisorDashboard"));
const LeadDashboard = lazy(() => import("./pages/dashboards/LeadDashboard"));
const MemberDashboard = lazy(() => import("./pages/dashboards/MemberDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-midTeal border-t-transparent" />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for exactly 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={
            <Layout fullWidth>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/publications"
          element={
            <Layout fullWidth>
              <Publications />
            </Layout>
          }
        />

        <Route
          path="/dashboard/director"
          element={
            <ProtectedRoute allowedRoles={["director", "admin"]}>
              <Layout>
                <DirectorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/advisor"
          element={
            <ProtectedRoute allowedRoles={["advisor", "admin"]}>
              <Layout>
                <AdvisorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/lead"
          element={
            <ProtectedRoute allowedRoles={["lead", "admin"]}>
              <Layout>
                <LeadDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/member"
          element={
            <ProtectedRoute>
              <Layout>
                <MemberDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;