import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminPendingListingsPage } from "../pages/AdminPendingListingsPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";
import { BrowsePetsPage } from "../pages/BrowsePetsPage";
import { CreateListingPage } from "../pages/CreateListingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { IncomingRequestsPage } from "../pages/IncomingRequestsPage";
import { LoginPage } from "../pages/LoginPage";
import { MyListingsPage } from "../pages/MyListingsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { OutgoingRequestsPage } from "../pages/OutgoingRequestsPage";
import { PetDetailsPage } from "../pages/PetDetailsPage";
import { ProfileSettingsPage } from "../pages/ProfileSettingsPage";
import { RegisterPage } from "../pages/RegisterPage";
import { VerifyEmailPage } from "../pages/VerifyEmailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "browse", element: <BrowsePetsPage /> },
      { path: "pets/:id", element: <PetDetailsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "dashboard/listings", element: <MyListingsPage /> },
          { path: "dashboard/listings/new", element: <CreateListingPage /> },
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
          { path: "admin/users", element: <AdminUsersPage /> }
        ]
      }
    ]
  }
]);
