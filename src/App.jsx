import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddVoucher from './pages/AddVoucher';
import VoucherList from './pages/VoucherList';
import LedgerSummary from './pages/LedgerSummary';
import TrialBalance from './pages/TrialBalance';
import ProfitLoss from './pages/ProfitLoss';
import BalanceSheet from './pages/BalanceSheet';
import Login from './pages/Login';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth'; // ✅ you already have this

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* All protected routes wrapped in RequireAuth and Layout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/add-voucher"
        element={
          <RequireAuth>
            <Layout>
              <AddVoucher />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/vouchers"
        element={
          <RequireAuth>
            <Layout>
              <VoucherList />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/ledger"
        element={
          <RequireAuth>
            <Layout>
              <LedgerSummary />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/trial-balance"
        element={
          <RequireAuth>
            <Layout>
              <TrialBalance />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/profit-loss"
        element={
          <RequireAuth>
            <Layout>
              <ProfitLoss />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/balance-sheet"
        element={
          <RequireAuth>
            <Layout>
              <BalanceSheet />
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
