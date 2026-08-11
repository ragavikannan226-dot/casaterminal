// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import { Toaster } from 'react-hot-toast';
// import { LocationProvider } from './context/LocationContext';
// import Layout from './components/layout/Layout';
// import Navbar from './components/layout/Navbar';
// import Footer from './components/layout/Footer';
// import LandingPage from './pages/LandingPage';
// import MemberPage from './pages/MemberPage';
// import ProductsPage from './pages/ProductsPage';
// import ProductDetailsPage from './components/ProductDetailsPage/ProductDetailsPage'; // Assuming you have a ProductDetailsPage component

// // Auth Pages
// import AdminLoginPage from './pages/auth/AdminLoginPage';

// import ProtectedRoute from './components/admin/auth/ProtectedRoute';

// // Admin Components
// import AdminLayout from './components/admin/AdminLayout';
// import Dashboard from './pages/admin/Dashboard';
// import SellerManagement from './pages/admin/SellerManagement';
// import ContractorManagement from './pages/admin/ContractorManagement';
// import RentalManagement from './pages/admin/RentalManagement';
// import ProductsManagement from './pages/admin/ProductsManagement';
// import PaymentsManagement from './pages/admin/PaymentsManagement';
// import Reports from './pages/admin/Reports';
// import Settings from './pages/admin/Settings';

// // Seller Pages
// import SellerRegistration from './pages/Seller/SellerRegistration';
// import SellerDashboard from './pages/Seller/SellerDashboard';

// // Contractor Pages
// import ContractorRegistration from './pages/Contractor/ContractorRegistration';
// import ContractorDashboard from './pages/Contractor/ContractorDashboard';
// import ContractorListing from './pages/Contractor/ContractorListing';
// import ContractorDetail from './pages/Contractor/ContractorDetail';

// // Rental Pages
// import RentalRegistration from './pages/Rental/RentalRegistration';
// import RentalDashboard from './pages/Rental/RentalDashboard';
// import RentalListing from './pages/Rental/RentalListing';
// import RentalDetail from './pages/Rental/RentalDetail';

// // Auto-scroll to top component on route changes
// function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }

// function App() {
//   return (
//     <LocationProvider>
//       <Router>
//         <ScrollToTop />
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: {
//               background: '#363636',
//               color: '#fff',
//             },
//             success: {
//               duration: 3000,
//               iconTheme: {
//                 primary: '#10b981',
//                 secondary: '#fff',
//               },
//             },
//             error: {
//               duration: 4000,
//               iconTheme: {
//                 primary: '#ef4444',
//                 secondary: '#fff',
//               },
//             },
//           }}
//         />

//         <AnimatePresence mode="wait">
//           <Routes>
//             {/* Public Routes with Navbar and Footer */}
//             <Route
//               path="/"
//               element={
//                 <>
//                   <Navbar />
//                   <LandingPage />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/member"
//               element={
//                 <>
//                   <Navbar />
//                   <MemberPage />
//                   <Footer />
//                 </>
//               }
//             />

//             {/* Auth Routes */}
//             <Route path="/admin/login" element={<AdminLoginPage />} />

//             {/* Public Listings (with Layout) */}
//             <Route
//               path="/products"
//               element={
//                 <Layout>
//                   <ProductsPage />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/product/:id"
//               element={
//                 <Layout>
//                   <ProductDetailsPage />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/contractors"
//               element={
//                 <Layout>
//                   <ContractorListing />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/contractor/:id"
//               element={
//                 <Layout>
//                   <ContractorDetail />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/rentals"
//               element={
//                 <Layout>
//                   <RentalListing />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/rental/:id"
//               element={
//                 <Layout>
//                   <RentalDetail />
//                 </Layout>
//               }
//             />

//             {/* Public Registration Routes (no authentication required) */}
//             <Route
//               path="/seller/register"
//               element={
//                 <Layout>
//                   <SellerRegistration />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/contractor/register"
//               element={
//                 <Layout>
//                   <ContractorRegistration />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/rental/register"
//               element={
//                 <Layout>
//                   <RentalRegistration />
//                 </Layout>
//               }
//             />

//             {/* Protected Admin Routes */}
//             <Route element={<ProtectedRoute allowedTypes={['admin']} />}>
//               <Route element={<AdminLayout />}>
//                 <Route path="/admin/dashboard" element={<Dashboard />} />
//                 <Route path="/admin/sellers" element={<SellerManagement />} />
//                 <Route path="/admin/contractors" element={<ContractorManagement />} />
//                 <Route path="/admin/rentals" element={<RentalManagement />} />
//                 <Route path="/admin/products" element={<ProductsManagement />} />
//                 <Route path="/admin/payments" element={<PaymentsManagement />} />
//                 <Route path="/admin/reports" element={<Reports />} />
//                 <Route path="/admin/settings" element={<Settings />} />
//               </Route>
//             </Route>

//             {/* Protected User Routes (only dashboards) */}
//             <Route element={<ProtectedRoute allowedTypes={['seller', 'contractor', 'rental', 'customer']} />}>
//               <Route
//                 path="/seller/dashboard"
//                 element={
//                   <Layout>
//                     <SellerDashboard />
//                   </Layout>
//                 }
//               />
//               <Route
//                 path="/contractor/dashboard"
//                 element={
//                   <Layout>
//                     <ContractorDashboard />
//                   </Layout>
//                 }
//               />
//               <Route
//                 path="/rental/dashboard"
//                 element={
//                   <Layout>
//                     <RentalDashboard />
//                   </Layout>
//                 }
//               />
//             </Route>

//             {/* Fallback Route */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </AnimatePresence>
//       </Router>
//     </LocationProvider>
//   );
// }

// export default App;


import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { LocationProvider } from './context/LocationContext';
import Layout from './components/layout/Layout';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import MemberPage from './pages/MemberPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './components/ProductDetailsPage/ProductDetailsPage';

// Auth Pages
import AdminLoginPage from './pages/auth/AdminLoginPage';

import ProtectedRoute from './components/admin/auth/ProtectedRoute';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import SellerManagement from './pages/admin/SellerManagement';
import ContractorManagement from './pages/admin/ContractorManagement';
import RentalManagement from './pages/admin/RentalManagement';
import ProductsManagement from './pages/admin/ProductsManagement';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Seller Pages
import SellerRegistration from './pages/Seller/SellerRegistration';
import SellerDashboard from './pages/Seller/SellerDashboard';

// Contractor Pages
import ContractorRegistration from './pages/Contractor/ContractorRegistration';
import ContractorDashboard from './pages/Contractor/ContractorDashboard';
import ContractorListing from './pages/Contractor/ContractorListing';
import ContractorDetail from './pages/Contractor/ContractorDetail';

// Rental Pages
import RentalRegistration from './pages/Rental/RentalRegistration';
import RentalDashboard from './pages/Rental/RentalDashboard';
import RentalListing from './pages/Rental/RentalListing';
import RentalDetail from './pages/Rental/RentalDetail';
import { BookingModal, BookingFormData } from './pages/Rental/BookingModal';

// Auto-scroll to top component on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Global modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedItem] = useState<any>(null); // Removed unused setter 'setSelectedItem'

  const handleBookingSubmit = (data: BookingFormData) => {
    console.log('Booking submitted for item:', selectedItem, data);
    toast.success('Consultation request sent successfully!');
  };

  return (
    <LocationProvider>
      <Router>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes with Navbar and Footer */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <LandingPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/member"
              element={
                <>
                  <Navbar />
                  <MemberPage />
                  <Footer />
                </>
              }
            />

            {/* Auth Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Public Listings (with Layout) */}
            <Route
              path="/products"
              element={
                <Layout>
                  <ProductsPage />
                </Layout>
              }
            />
            <Route
              path="/product/:id"
              element={
                <Layout>
                  <ProductDetailsPage />
                </Layout>
              }
            />
            <Route
              path="/contractors"
              element={
                <Layout>
                  <ContractorListing />
                </Layout>
              }
            />
            <Route
              path="/contractor/:id"
              element={
                <Layout>
                  <ContractorDetail />
                </Layout>
              }
            />
            <Route
              path="/rentals"
              element={
                <Layout>
                  <RentalListing />
                </Layout>
              }
            />
            <Route
              path="/rental/:id"
              element={
                <Layout>
                  <RentalDetail />
                </Layout>
              }
            />

            {/* Public Registration Routes */}
            <Route
              path="/seller/register"
              element={
                <Layout>
                  <SellerRegistration />
                </Layout>
              }
            />
            <Route
              path="/contractor/register"
              element={
                <Layout>
                  <ContractorRegistration />
                </Layout>
              }
            />
            <Route
              path="/rental/register"
              element={
                <Layout>
                  <RentalRegistration />
                </Layout>
              }
            />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedTypes={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/sellers" element={<SellerManagement />} />
                <Route path="/admin/contractors" element={<ContractorManagement />} />
                <Route path="/admin/rentals" element={<RentalManagement />} />
                <Route path="/admin/products" element={<ProductsManagement />} />
                <Route path="/admin/payments" element={<PaymentsManagement />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute allowedTypes={['seller', 'contractor', 'rental', 'customer']} />}>
              <Route
                path="/seller/dashboard"
                element={
                  <Layout>
                    <SellerDashboard />
                  </Layout>
                }
              />
              <Route
                path="/contractor/dashboard"
                element={
                  <Layout>
                    <ContractorDashboard />
                  </Layout>
                }
              />
              <Route
                path="/rental/dashboard"
                element={
                  <Layout>
                    <RentalDashboard />
                  </Layout>
                }
              />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>

        {/* Global Booking Modal Render */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onSubmit={handleBookingSubmit}
        />
      </Router>
    </LocationProvider>
  );
}

export default App;