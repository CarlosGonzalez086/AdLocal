import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppUser from "./User/AppUser";
import AppAdmin from "./Admin/AppAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        <Route path="/usuario/*" element={<AppUser />} />
        <Route path="/admin/*" element={<AppAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
