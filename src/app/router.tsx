import { Navigate, Route, Routes } from "react-router-dom";
import { MeetingDetail, MeetingList } from "./features/Meetings/pages";
import SignIn from "./features/Auth/pages/SignIn";
import ProtectedRoute from "./features/Auth/components/ProtectedRoute";
import { AppShell } from "./components";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<Navigate to="/meetings" replace />} />
      <Route
        path="/meetings"
        element={
          <ProtectedRoute>
            <AppShell>
              <MeetingList />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/meetings/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <MeetingDetail />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
