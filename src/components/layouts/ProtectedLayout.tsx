
import PrivateRoute from "../../routes/PrivateRoute";
import LayoutProtected from "./LayoutProtected";

const ProtectedLayout = () => (
  <PrivateRoute>
    <LayoutProtected />
  </PrivateRoute>
);

export default ProtectedLayout;
