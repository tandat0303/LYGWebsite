import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import AuthBootstrap from "./routes/AuthBootstrap";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthBootstrap />}>
        <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}
