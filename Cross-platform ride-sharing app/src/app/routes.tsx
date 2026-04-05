import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { SearchResults } from "./pages/SearchResults";
import { RideDetails } from "./pages/RideDetails";
import { PublishRide } from "./pages/PublishRide";
import { Dashboard } from "./pages/Dashboard";
import { Premium } from "./pages/Premium";
import { ProtectedRoute } from "./context/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/search",
    Component: SearchResults,
  },
  {
    path: "/ride/:id",
    Component: RideDetails,
  },
  {
    path: "/publish",
    Component: () => (
      <ProtectedRoute requiredRole={["normal", "owner"]}>
        <PublishRide />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    Component: () => (
      <ProtectedRoute requiredRole={["normal", "owner"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/premium",
    Component: Premium,
  },
]);
