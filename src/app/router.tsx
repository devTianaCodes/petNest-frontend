import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <HomePage /> },
      { path: "adopt", lazy: async () => ({ Component: (await import("../pages/AdoptPage")).AdoptPage }) },
      { path: "browse", lazy: async () => ({ Component: (await import("../pages/BrowsePetsPage")).BrowsePetsPage }) },
      { path: "pets/:id/:petSlug?", lazy: async () => ({ Component: (await import("../pages/PetDetailsPage")).PetDetailsPage }) },
      { path: "auth", lazy: async () => ({ Component: (await import("../pages/AuthPage")).AuthPage }) },
      { path: "login", element: <Navigate to="/auth" replace /> },
      { path: "register", element: <Navigate to="/auth?mode=register" replace /> },
      { path: "verify-email", lazy: async () => ({ Component: (await import("../pages/VerifyEmailPage")).VerifyEmailPage }) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", lazy: async () => ({ Component: (await import("../pages/DashboardPage")).DashboardPage }) },
          { path: "dashboard/analytics", lazy: async () => ({ Component: (await import("../pages/ListingAnalyticsPage")).ListingAnalyticsPage }) },
          { path: "dashboard/listings", lazy: async () => ({ Component: (await import("../pages/MyListingsPage")).MyListingsPage }) },
          { path: "dashboard/favorites", lazy: async () => ({ Component: (await import("../pages/FavoritesPage")).FavoritesPage }) },
          { path: "dashboard/searches", lazy: async () => ({ Component: (await import("../pages/SavedSearchesPage")).SavedSearchesPage }) },
          { path: "dashboard/listings/new", lazy: async () => ({ Component: (await import("../pages/CreateListingPage")).CreateListingPage }) },
          { path: "dashboard/listings/:id/edit", lazy: async () => ({ Component: (await import("../pages/EditListingPage")).EditListingPage }) },
          { path: "dashboard/profile", lazy: async () => ({ Component: (await import("../pages/ProfileSettingsPage")).ProfileSettingsPage }) },
          { path: "dashboard/requests/incoming", lazy: async () => ({ Component: (await import("../pages/IncomingRequestsPage")).IncomingRequestsPage }) },
          { path: "dashboard/requests/outgoing", lazy: async () => ({ Component: (await import("../pages/OutgoingRequestsPage")).OutgoingRequestsPage }) }
        ]
      },
      {
        element: <ProtectedRoute role="ADMIN" />,
        children: [
          { path: "admin", lazy: async () => ({ Component: (await import("../pages/AdminDashboardPage")).AdminDashboardPage }) },
          { path: "admin/pending", lazy: async () => ({ Component: (await import("../pages/AdminPendingListingsPage")).AdminPendingListingsPage }) },
          { path: "admin/reports", lazy: async () => ({ Component: (await import("../pages/AdminReportsPage")).AdminReportsPage }) },
          { path: "admin/users", lazy: async () => ({ Component: (await import("../pages/AdminUsersPage")).AdminUsersPage }) }
        ]
      }
    ]
  }
]);
