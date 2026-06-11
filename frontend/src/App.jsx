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

const PublicationDetail = lazy(() => import("./pages/PublicationDetail"));

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
    const imagesToPreload = [
      "/Images/logo.png",
      "/Images/Brain2.png",
      "/Images/Leader.png",
      "/Images/Tahsin.png",
      "/Images/advisor2.jpg",
      "/Images/Advisor1.jpg",
      "/Images/passport-size_photo.jpg",
      "/Images/Sunipun.png",
      "/Images/SIFAT.jpg",
      "/Images/MOYNUL.png",
      "/Images/Arko.png",
      "/Images/tamim.png",
      "/Images/chaki.jpeg",
      "/Images/Asif.png"
    ];

    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // resolve anyway to avoid hanging indefinitely on failure
      });
    };

    const preloadAll = async () => {
      try {
        const preloadPromises = imagesToPreload.map((src) => preloadImage(src));
        // Wait for both the minimum 3 seconds timer AND all images to finish preloading
        await Promise.all([
          ...preloadPromises,
          new Promise((resolve) => setTimeout(resolve, 3000))
        ]);
      } catch (err) {
        console.error("Failed to preload images:", err);
      } finally {
        setIsLoading(false);
      }
    };

    preloadAll();
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
          path="/publications/:id"
          element={
            <Layout fullWidth>
              <PublicationDetail />
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