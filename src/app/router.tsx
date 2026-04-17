import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminPendingListingsPage } from "../pages/AdminPendingListingsPage";
import { AdminReportsPage } from "../pages/AdminReportsPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";
import { AdoptPage } from "../pages/AdoptPage";
import { AuthPage } from "../pages/AuthPage";
import { BrowsePetsPage } from "../pages/BrowsePetsPage";
import { CreateListingPage } from "../pages/CreateListingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EditListingPage } from "../pages/EditListingPage";
import { FavoritesPage } from "../pages/FavoritesPage";
import { HomePage } from "../pages/HomePage";
import { IncomingRequestsPage } from "../pages/IncomingRequestsPage";
import { LoginPage } from "../pages/LoginPage";
import { ListingAnalyticsPage } from "../pages/ListingAnalyticsPage";
import { MyListingsPage } from "../pages/MyListingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OutgoingRequestsPage } from "../pages/OutgoingRequestsPage";
import { PetDetailsPage } from "../pages/PetDetailsPage";
import { ProfileSettingsPage } from "../pages/ProfileSettingsPage";
import { RegisterPage } from "../pages/RegisterPage";
import { SavedSearchesPage } from "../pages/SavedSearchesPage";
import { VerifyEmailPage } from "../pages/VerifyEmailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "adopt", element: <AdoptPage /> },
      { path: "browse", element: <BrowsePetsPage /> },
      { path: "pets/:id", element: <PetDetailsPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "login", element: <Navigate to="/auth" replace /> },
      { path: "register", element: <Navigate to="/auth?mode=register" replace /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "dashboard/analytics", element: <ListingAnalyticsPage /> },
          { path: "dashboard/listings", element: <MyListingsPage /> },
          { path: "dashboard/favorites", element: <FavoritesPage /> },
          { path: "dashboard/searches", element: <SavedSearchesPage /> },
          { path: "dashboard/listings/new", element: <CreateListingPage /> },
          { path: "dashboard/listings/:id/edit", element: <EditListingPage /> },
          { path: "dashboard/profile", element: <ProfileSettingsPage /> },
          { path: "dashboard/requests/incoming", element: <IncomingRequestsPage /> },
          { path: "dashboard/requests/outgoing", element: <OutgoingRequestsPage /> }
        ]
      },
      {
        element: <ProtectedRoute role="ADMIN" />,
        children: [
          { path: "admin", element: <AdminDashboardPage /> },
          { path: "admin/pending", element: <AdminPendingListingsPage /> },
          { path: "admin/reports", element: <AdminReportsPage /> },
          { path: "admin/users", element: <AdminUsersPage /> }
        ]
      }
    ]
  }
]);
