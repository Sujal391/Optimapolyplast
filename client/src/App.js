import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit,faTrashCan } from "@fortawesome/free-solid-svg-icons";

// Layout components
import Header from './components/layout/Header';
import AuthLayout from './components/layout/AuthLayout';
import PrivateRoute from './components/layout/PrivateRoute';

// Auth components
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';

// Admin Panel Components
import AdminDashboard from './components/admin/Dashboard';
import AdminMarketing from './components/admin/Marketing';
import UploadBanner from './components/admin/UploadBanner';
import AdminAttendance from './components/admin/AdminAttendance';
import UserList from './components/admin/UserList';
import CreateUser from './components/admin/CreateUser';
import TotalUser from './components/reception/TotalUser';

// Reception Panel Components
import ReceptionDashboard from './components/reception/Dashboard';
import ReceptionAttendance from './components/reception/Attendance';
import DeliveryCharge from './components/reception/DeliveryCharge';
import PendingOrder from './components/reception/PendingOrder';
import CreateOrder from './components/reception/CreateOrder';
import TotalOrder from './components/reception/TotalOrder';
import ReceptionPendingPayment from './components/reception/PendingPayment';

// Dispatch Panel Components
import DispatchDashboard from './components/dispatch/Dashboard';
import DispatchAttendance from './components/dispatch/Attendance';
import DispatchList from './components/dispatch/DispatchList';
import DispatchHistory from './components/dispatch/DispatchHistory';
import ChallanHistory from './components/dispatch/ChallanHistory';
import PendingPayment from './components/dispatch/PendingPayment';

// Stock Panel Components
import StockDashboard from './components/stock/Dashboard';
import StockAttendance from './components/stock/Attendance';
import StockList from './components/admin/StockList';
import AddStock from './components/stock/AddStock';

// Shared Components
import OrderList from './components/admin/OrderList';
import ProductList from './components/admin/ProductList';

library.add(faEdit, faTrashCan);

// Conditional Header rendering (only for admin routes)
function HeaderWithConditionalRender() {
  const location = useLocation();
  const publicPaths = ['/', '/ForgotPassword'];
  
  if (publicPaths.includes(location.pathname)) {
    return null;
  }

  return <Header />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        {/* Admin Panel Routes */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute allowedRoles={['admin']}>
            <HeaderWithConditionalRender />
            <AuthLayout>
              <AdminDashboard />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/users" element={
          <PrivateRoute allowedRoles={['admin']}>
            <HeaderWithConditionalRender />
            <AuthLayout>
              <UserList />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/attandance" element={
          <PrivateRoute allowedRoles={['admin']}>
            <HeaderWithConditionalRender />
            <AuthLayout>
              <AdminAttendance />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/createUser" element={
          <PrivateRoute allowedRoles={['admin']}>
            <HeaderWithConditionalRender />
            <AuthLayout>
              <CreateUser />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/upload-banner" element={
          <PrivateRoute allowedRoles={['admin']}>
            <HeaderWithConditionalRender />
            <AuthLayout>
              <UploadBanner />
            </AuthLayout>
          </PrivateRoute>
        }/>

        {/* Reception Panel Routes */}
        <Route path="/reception/dashboard" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/total-users" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
              <TotalUser />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/total-orders" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
              <TotalOrder />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/attandance/reception" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
              <ReceptionAttendance />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/pending-orders" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
              <PendingOrder />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/add-delivery-charges" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
              <DeliveryCharge />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/create-order" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
              <CreateOrder />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/reception/pending-payments" element={
          <PrivateRoute allowedRoles={['reception']}>
            <AuthLayout>
              <ReceptionDashboard />
              <ReceptionPendingPayment />
            </AuthLayout>
          </PrivateRoute>
        }/>

        {/* Stock Panel Routes */}
        <Route path="/stock/dashboard" element={
          <PrivateRoute allowedRoles={['stock']}>
            <AuthLayout>
              <StockDashboard />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/attandance/stock" element={
          <PrivateRoute allowedRoles={['stock']}>
            <AuthLayout>
              <StockDashboard />
              <StockAttendance />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/Add-Stocks" element={
          <PrivateRoute allowedRoles={['stock']}>
            <AuthLayout>
              <StockDashboard />
              <AddStock />
            </AuthLayout>
          </PrivateRoute>
        }/>

        {/* Dispatch Panel Routes */}
        <Route path="/dispatch/dashboard" element={
          <PrivateRoute allowedRoles={['dispatch']}>
            <AuthLayout>
              <DispatchDashboard />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/dispatch/attandance" element={
          <PrivateRoute allowedRoles={['dispatch']}>
            <AuthLayout>
              <DispatchDashboard />
              <DispatchAttendance />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/dispatch/processing-orders" element={
          <PrivateRoute allowedRoles={['dispatch']}>
            <AuthLayout>
              <DispatchDashboard />
              <DispatchList />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/dispatch/dispatch-history" element={
          <PrivateRoute allowedRoles={['dispatch']}>
            <AuthLayout>
              <DispatchDashboard />
              <DispatchHistory />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/dispatch/challan-history" element={
          <PrivateRoute allowedRoles={['dispatch']}>
            <AuthLayout>
              <DispatchDashboard />
              <ChallanHistory />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/dispatch/pending-payment" element={
          <PrivateRoute allowedRoles={['dispatch']}>
            <AuthLayout>
              <DispatchDashboard />
              <PendingPayment />
            </AuthLayout>
          </PrivateRoute>
        }/>

        {/* Shared Routes with Role Restrictions */}
        <Route path="/order" element={
          <PrivateRoute allowedRoles={['admin', 'reception']}>
            {['admin'].some(role => ['admin', 'reception'].includes(role)) && <HeaderWithConditionalRender />}
            <AuthLayout>
              <OrderList />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/product" element={
          <PrivateRoute allowedRoles={['admin', 'stock']}>
            {['admin'].some(role => ['admin', 'stock'].includes(role)) && <HeaderWithConditionalRender />}
            <AuthLayout>
              <ProductList />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/stock" element={
          <PrivateRoute allowedRoles={['admin', 'stock']}>
            {['admin'].some(role => ['admin', 'stock'].includes(role)) && <HeaderWithConditionalRender />}
            <AuthLayout>
              <StockList />
            </AuthLayout>
          </PrivateRoute>
        }/>
        <Route path="/marketing" element={
          <PrivateRoute allowedRoles={['admin', 'marketing']}>
            {['admin'].some(role => ['admin', 'marketing'].includes(role)) && <HeaderWithConditionalRender />}
            <AuthLayout>
              <AdminMarketing />
            </AuthLayout>
          </PrivateRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;