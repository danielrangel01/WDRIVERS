import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Vehicles from "./pages/Vehicles";
import ActivityLog from "./pages/ActivityLog";
import Conductor from "./pages/Conductor";
import MonthlyReport from "./pages/MonthlyReport";
import HistorialPagos from "./pages/HistorialPagos";
import AgregarGasto from "./pages/AgregarGasto";
import ListaGastos from "./pages/ListaGastos";
import PagosPendientes from "./pages/PagosPendientes";
import MisDeudas from "./pages/MisDeudas";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import DeudasAdmin from "./pages/DeudasAdmin";

function App() {
  const location = useLocation();
  // Si quieres ocultar el navbar en el login, puedes usar:
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Redirección raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        {/* Rutas solo para administradores */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <Users />
            </RequireAuth>
          }
        />

        <Route
          path="/vehiculos"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <Vehicles />
            </RequireAuth>
          }
        />

        <Route
          path="/gastos/agregar"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AgregarGasto />
            </RequireAuth>
          }
        />

        <Route
          path="/gastos/lista"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ListaGastos />
            </RequireAuth>
          }
        />

        <Route
          path="/actividad"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ActivityLog />
            </RequireAuth>
          }
        />

        <Route
          path="/deudas-admin"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <DeudasAdmin />
            </RequireAuth>
          }
        />
        <Route
          path="/reportes"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <MonthlyReport />
            </RequireAuth>
          }
        />

        <Route
          path="/pagos-pendientes"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <PagosPendientes />
            </RequireAuth>
          }
        />

        {/* Ruta solo para conductores */}
        <Route
          path="/conductor"
          element={
            <RequireAuth allowedRoles={["conductor"]}>
              <Conductor />
            </RequireAuth>
          }
        />

        <Route
          path="/historial"
          element={
            <RequireAuth allowedRoles={["conductor"]}>
              <HistorialPagos />
            </RequireAuth>
          }
        />
        <Route
          path="/mis-deudas"
          element={
            <RequireAuth allowedRoles={["conductor"]}>
              <MisDeudas />
            </RequireAuth>
          }
        />

        {/* Ruta catch-all: redirige a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
