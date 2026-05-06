import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import AuthBootstrap from "./routes/AuthBootstrap";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import ChangePassword from "./pages/auth/ChangePassword";
import UserInfo from "./pages/UserInfo";
import Guide from "./pages/Guide";
import Note from "./pages/Note";
import Attendance from "./pages/attendance/Attendance";
import NewsPage from "./pages/news/NewsPage";
import ContactPage from "./pages/contact/ContactPage";
import AppDownload from "./pages/AppDownload";
import LeavePage from "./pages/leave/LeavePage";
import OvertimePage from "./pages/overtime/OvertimePage";
import NotFound from "./pages/NotFound";
import Salary from "./pages/salary/MainSalary/Salary";
import ThirteenthSalaryPage from "./pages/salary/BonusSalary/ThirteenthSalaryPage";
import SeveranceSalary from "./pages/salary/SeveranceSalary/SeveranceSalary";
import GeneralAffairPage from "./pages/report/GeneralAffair/GeneralAffairPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthBootstrap />}>
        <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/bonus" element={<ThirteenthSalaryPage />} />
            <Route path="/severance-salary" element={<SeveranceSalary />} />
            <Route path="/holidays" element={<LeavePage />} />
            <Route path="/overtime" element={<OvertimePage />} />

            <Route path="/attendance" element={<Attendance />} />

            <Route path="/news" element={<NewsPage />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/app-download" element={<AppDownload />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/note" element={<Note />} />
            <Route path="/guide" element={<Guide />} />

            <Route path="/general-affair" element={<GeneralAffairPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
