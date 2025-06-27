import { useEffect, useState } from "react";
import api from "../services/api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function MonthlyReport() {
  const [resumen, setResumen] = useState([]);
  const [totales, setTotales] = useState({
    ingresosTotales: 0,
    gastosTotales: 0,
    totalDeudas: 0,
    utilidadTotal: 0,
  });
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/reportes/mensual", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumen(res.data.resumen);
      setTotales(res.data.totales);
      setMovimientos(res.data.movimientos);
    };
    fetchReport();
  }, []);

  const exportToExcel = async () => {
    const wb = new ExcelJS.Workbook();

    // Resumen por vehículo
    const resumenSheet = wb.addWorksheet("Resumen Mensual");
    resumenSheet.addRow(["PLACA", "INGRESOS", "GASTOS", "DEUDAS", "UTILIDAD"]);
    resumen.forEach((v) => {
      resumenSheet.addRow([
        v.placa,
        v.ingresos,
        v.gastos,
        v.deudas,
        v.utilidad,
      ]);
    });
    resumenSheet.addRow([]);
    resumenSheet.addRow([
      "TOTAL GENERAL",
      totales.ingresosTotales,
      totales.gastosTotales,
      totales.totalDeudas,
      totales.utilidadTotal,
    ]);

    // Movimientos detallados
    const movimientosSheet = wb.addWorksheet("Movimientos");
    movimientosSheet.addRow([
      "FECHA",
      "PLACA",
      "TIPO",
      "DESCRIPCIÓN",
      "MONTO",
    ]);
    movimientos.forEach((m) => {
      movimientosSheet.addRow([
        new Date(m.fecha).toLocaleDateString(),
        m.placa,
        m.tipo,
        m.descripcion,
        m.monto,
      ]);
    });

    // Hoja sólo de deudas
    const deudasSheet = wb.addWorksheet("Deudas Detalladas");
    deudasSheet.addRow(["PLACA", "MONTO", "FECHA"]);
    movimientos
      .filter((m) => m.tipo.startsWith("Deuda"))
      .forEach((d) =>
        deudasSheet.addRow([d.placa, d.monto, new Date(d.fecha).toLocaleDateString()])
      );

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "reporte_mensual_completo.xlsx");
  };

  return (
    <div className="container">
      <h2>📊 Reporte Mensual</h2>
      <div>
        <h3>Totales</h3>
        <p>💰 Ingresos totales: ${totales.ingresosTotales}</p>
        <p>📉 Gastos totales: ${totales.gastosTotales}</p>
        <p>⚠️ Deudas totales: ${totales.totalDeudas}</p>
        <p>📈 Utilidad neta: ${totales.utilidadTotal}</p>
      </div>
      <button onClick={exportToExcel} style={{ marginBottom: "1rem" }}>
        Exportar a Excel
      </button>
      <div style={{ marginTop: 32 }}>
        <h3>Movimientos del mes</h3>
        <ul>
          {movimientos.map((m, i) => (
            <li key={i}>
              {new Date(m.fecha).toLocaleDateString()} — {m.tipo} — {m.descripcion} — ${m.monto} — {m.placa}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MonthlyReport;
