import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DirectorDashboard from "./pages/dashboards/DirectorDashboard";
import AdvisorDashboard from "./pages/dashboards/AdvisorDashboard";
import LeadDashboard from "./pages/dashboards/LeadDashboard";
import MemberDashboard from "./pages/dashboards/MemberDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
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
  );
}

export default App;

