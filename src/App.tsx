import { Outlet } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";

export function App() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
