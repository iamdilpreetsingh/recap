import { Navigate, Route, Routes } from "react-router-dom";
import { MeetingDetail, MeetingList } from "./features/Meetings/pages";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/meetings" replace />} />
      <Route path="/meetings" element={<MeetingList />} />
      <Route path="/meetings/:id" element={<MeetingDetail />} />
    </Routes>
  );
}
