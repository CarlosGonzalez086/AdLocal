import PrivateRoute from "../../routes/PrivateRoute";
import LayoutProtected from "./LayoutProtected";

const ProtectedLayout = ({ role }: { role?: "Admin" | "Comercio" }) => (
  <PrivateRoute role={role}>
    <LayoutProtected />
  </PrivateRoute>
);

export default ProtectedLayout;
