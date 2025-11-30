import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage2";
import RegisterPage from "./pages/RegisterPage2";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import BorrowRequestPage from "./pages/BorrowRequestPage";
import PaymentPage from "./pages/PaymentPage";
import MyBorrowsPage from "./pages/MyBorrowsPage";
import MyItemsPage from "./pages/MyItemsPage";
import ReviewFormPage from "./pages/ReviewFormPage";
import ProfilePage from "./pages/ProfilePage";
import AddItemPage from "./pages/AddItemPage";
import ApproveRequestsPage from "./pages/ApproveRequestsPage";
import ChatPage from "./pages/ChatPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import AdminDashboard from "./pages/AdminDashboard"
import Layout from "./components/Layout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* Pages without Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages WITH Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/borrow/:itemId" element={<BorrowRequestPage />} />
          <Route path="/payment/:borrowId" element={<PaymentPage />} />
          <Route path="/my-borrows" element={<MyBorrowsPage />} />
          <Route path="/my-items" element={<MyItemsPage />} />
          <Route path="/review/:borrowId" element={<ReviewFormPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/approve-requests" element={<ApproveRequestsPage />} />
          <Route path="/chat/:itemId/:ownerId" element={<ChatPage />} />
          <Route path="/payment-success/:borrowId" element={<PaymentSuccessPage />} />
          <Route path="/review/:borrowId" element={<ReviewFormPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* More pages can be added here in the future */}
      </Routes>
    </Router>
  );
}

export default App;
