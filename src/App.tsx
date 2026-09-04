import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

// ============================================================
// CONTEXT
// ============================================================

import { LocationProvider } from "./context/LocationContext";

// ============================================================
// MAIN LAYOUT
// ============================================================

import Layout from "./components/layout/Layout";

// ============================================================
// MAIN PAGES
// ============================================================

import LandingPage from "./pages/LandingPage";
import MemberPage from "./pages/MemberPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./components/ProductDetailsPage/ProductDetailsPage";

// ============================================================
// USER PAGES
// ============================================================

import Profile from "./components/layout/Profile";
import Wishlist from "./components/layout/Wishlist";
import Cart from "./components/layout/Cart";
import MyOrders from "./components/layout/MyOrders";
import UserSettings from "./components/layout/Settings";

// ============================================================
// AUTH
// ============================================================

import { AuthModal } from "./pages/auth/AuthModal";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import ProtectedRoute from "./components/admin/auth/ProtectedRoute";

// ============================================================
// ADMIN
// ============================================================

import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import SellerManagement from "./pages/admin/SellerManagement";
import ContractorManagement from "./pages/admin/ContractorManagement";
import RentalManagement from "./pages/admin/RentalManagement";
import ProductsManagement from "./pages/admin/ProductsManagement";
import PaymentsManagement from "./pages/admin/PaymentsManagement";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

// ============================================================
// SELLER
// ============================================================

import SellerRegistration from "./pages/Seller/SellerRegistration";
import SellerDashboard from "./pages/Seller/SellerDashboard";

// ============================================================
// CONTRACTOR
// ============================================================

import ContractorRegistration from "./pages/Contractor/ContractorRegistration";
import ContractorDashboard from "./pages/Contractor/ContractorDashboard";
import ContractorListing from "./pages/Contractor/ContractorListing";
import ContractorDetail from "./pages/Contractor/ContractorDetail";

// ============================================================
// RENTAL
// ============================================================

import RentalRegistration from "./pages/Rental/RentalRegistration";
import RentalDashboard from "./pages/Rental/RentalDashboard";
import RentalListing from "./pages/Rental/RentalListing";
import RentalDetail from "./pages/Rental/RentalDetail";

// ============================================================
// BOOKING
// ============================================================

import {
  BookingModal,
  BookingFormData,
} from "./pages/Rental/BookingModal";

// ============================================================
// SCROLL TO TOP
// ============================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

// ============================================================
// APP
// ============================================================

function App() {
  // ==========================================================
  // LOGIN STATE
  // ==========================================================

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem(
        "casa_terminal_user"
      );

      return Boolean(savedUser);
    } catch (error) {
      console.error(
        "Unable to read login state:",
        error
      );

      return false;
    }
  });

  // ==========================================================
  // BOOKING STATE
  // ==========================================================

  const [isBookingOpen, setIsBookingOpen] =
    useState<boolean>(false);

  // ==========================================================
  // LOGIN CHECK
  // ==========================================================

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(
        "casa_terminal_user"
      );

      setIsLoggedIn(Boolean(savedUser));
    } catch (error) {
      console.error(
        "Login check failed:",
        error
      );

      setIsLoggedIn(false);
    }
  }, []);

  // ==========================================================
  // BOOKING SUBMIT
  // ==========================================================

  const handleBookingSubmit = (
    data: BookingFormData
  ) => {
    console.log(
      "Booking submitted:",
      data
    );

    toast.success(
      "Consultation request sent successfully!"
    );

    setIsBookingOpen(false);
  };

  // ==========================================================
  // LOGIN SUCCESS
  // ==========================================================

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);

    toast.success(
      "Welcome to CASA TERMINAL!"
    );
  };

  // ==========================================================
  // LOGIN SCREEN
  // ==========================================================

  if (!isLoggedIn) {
    return (
      <AuthModal
        onSuccess={handleLoginSuccess}
      />
    );
  }

  // ==========================================================
  // MAIN APPLICATION
  // ==========================================================

  return (
    <LocationProvider>
      <Router>

        {/* ====================================================
            SCROLL TO TOP
        ==================================================== */}

        <ScrollToTop />

        {/* ====================================================
            TOASTER
        ==================================================== */}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

        {/* ====================================================
            APPLICATION ROUTES
        ==================================================== */}

        <AnimatePresence mode="wait">

          <Routes>

            {/* ==================================================
                HOME
            ================================================== */}

            <Route
              path="/"
              element={
                <Layout>
                  <LandingPage />
                </Layout>
              }
            />

            {/* ==================================================
                MEMBER
            ================================================== */}

            <Route
              path="/member"
              element={
                <Layout>
                  <MemberPage />
                </Layout>
              }
            />

            {/* ==================================================
                PRODUCTS
            ================================================== */}

            <Route
              path="/products"
              element={
                <Layout>
                  <ProductsPage />
                </Layout>
              }
            />

            {/* ==================================================
                PRODUCT DETAILS
            ================================================== */}

            <Route
              path="/product/:id"
              element={
                <Layout>
                  <ProductDetailsPage />
                </Layout>
              }
            />

            {/* ==================================================
                PROFILE
            ================================================== */}

            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />

            {/* ==================================================
                WISHLIST
            ================================================== */}

            <Route
              path="/wishlist"
              element={
                <Layout>
                  <Wishlist />
                </Layout>
              }
            />

            {/* ==================================================
                CART
            ================================================== */}

            <Route
              path="/cart"
              element={
                <Layout>
                  <Cart />
                </Layout>
              }
            />

            {/* ==================================================
                MY ORDERS
            ================================================== */}

            <Route
              path="/orders"
              element={
                <Layout>
                  <MyOrders />
                </Layout>
              }
            />

            {/* ==================================================
                USER SETTINGS
                IMPORTANT:
                This is the customer/user settings page.
            ================================================== */}

            <Route
              path="/settings"
              element={
                <Layout>
                  <UserSettings />
                </Layout>
              }
            />

            {/* ==================================================
                ADMIN LOGIN
            ================================================== */}

            <Route
              path="/admin/login"
              element={
                <AdminLoginPage />
              }
            />

            {/* ==================================================
                CONTRACTOR LISTING
            ================================================== */}

            <Route
              path="/contractors"
              element={
                <Layout>
                  <ContractorListing />
                </Layout>
              }
            />

            {/* ==================================================
                CONTRACTOR DETAILS
            ================================================== */}

            <Route
              path="/contractor/:id"
              element={
                <Layout>
                  <ContractorDetail />
                </Layout>
              }
            />

            {/* ==================================================
                RENTAL LISTING
            ================================================== */}

            <Route
              path="/rentals"
              element={
                <Layout>
                  <RentalListing />
                </Layout>
              }
            />

            {/* ==================================================
                RENTAL DETAILS
            ================================================== */}

            <Route
              path="/rental/:id"
              element={
                <Layout>
                  <RentalDetail />
                </Layout>
              }
            />

            {/* ==================================================
                SELLER REGISTRATION
            ================================================== */}

            <Route
              path="/seller/register"
              element={
                <Layout>
                  <SellerRegistration />
                </Layout>
              }
            />

            {/* ==================================================
                CONTRACTOR REGISTRATION
            ================================================== */}

            <Route
              path="/contractor/register"
              element={
                <Layout>
                  <ContractorRegistration />
                </Layout>
              }
            />

            {/* ==================================================
                RENTAL REGISTRATION
            ================================================== */}

            <Route
              path="/rental/register"
              element={
                <Layout>
                  <RentalRegistration />
                </Layout>
              }
            />

            {/* ==================================================
                USER PROTECTED ROUTES
            ================================================== */}

            <Route
              element={
                <ProtectedRoute
                  allowedTypes={[
                    "seller",
                    "contractor",
                    "rental",
                    "customer",
                  ]}
                />
              }
            >

              {/* ==================================================
                  SELLER DASHBOARD
              ================================================== */}

              <Route
                path="/seller/dashboard"
                element={
                  <Layout>
                    <SellerDashboard />
                  </Layout>
                }
              />

              {/* ==================================================
                  CONTRACTOR DASHBOARD
              ================================================== */}

              <Route
                path="/contractor/dashboard"
                element={
                  <Layout>
                    <ContractorDashboard />
                  </Layout>
                }
              />

              {/* ==================================================
                  RENTAL DASHBOARD
              ================================================== */}

              <Route
                path="/rental/dashboard"
                element={
                  <Layout>
                    <RentalDashboard />
                  </Layout>
                }
              />

            </Route>

            {/* ==================================================
                ADMIN PROTECTED ROUTES
            ================================================== */}

            <Route
              element={
                <ProtectedRoute
                  allowedTypes={["admin"]}
                />
              }
            >

              {/* ==================================================
                  ADMIN LAYOUT
              ================================================== */}

              <Route
                element={
                  <AdminLayout />
                }
              >

                {/* ==================================================
                    ADMIN DASHBOARD
                ================================================== */}

                <Route
                  path="/admin/dashboard"
                  element={
                    <Dashboard />
                  }
                />

                {/* ==================================================
                    ADMIN SELLERS
                ================================================== */}

                <Route
                  path="/admin/sellers"
                  element={
                    <SellerManagement />
                  }
                />

                {/* ==================================================
                    ADMIN CONTRACTORS
                ================================================== */}

                <Route
                  path="/admin/contractors"
                  element={
                    <ContractorManagement />
                  }
                />

                {/* ==================================================
                    ADMIN RENTALS
                ================================================== */}

                <Route
                  path="/admin/rentals"
                  element={
                    <RentalManagement />
                  }
                />

                {/* ==================================================
                    ADMIN PRODUCTS
                ================================================== */}

                <Route
                  path="/admin/products"
                  element={
                    <ProductsManagement />
                  }
                />

                {/* ==================================================
                    ADMIN PAYMENTS
                ================================================== */}

                <Route
                  path="/admin/payments"
                  element={
                    <PaymentsManagement />
                  }
                />

                {/* ==================================================
                    ADMIN REPORTS
                ================================================== */}

                <Route
                  path="/admin/reports"
                  element={
                    <Reports />
                  }
                />

                {/* ==================================================
                    ADMIN SETTINGS
                ================================================== */}

                <Route
                  path="/admin/settings"
                  element={
                    <AdminSettings />
                  }
                />

              </Route>

            </Route>

            {/* ==================================================
                404 / UNKNOWN ROUTE
            ================================================== */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </AnimatePresence>

        {/* ====================================================
            BOOKING MODAL
            IMPORTANT:
            OUTSIDE <Routes>
        ==================================================== */}

        <BookingModal
          isOpen={isBookingOpen}
          onClose={() =>
            setIsBookingOpen(false)
          }
          onSubmit={handleBookingSubmit}
        />

      </Router>
    </LocationProvider>
  );
}

export default App;