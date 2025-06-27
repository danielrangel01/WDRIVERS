import { useEffect, useState } from 'react';
import api from '../services/api';

function FinanceSummary() {
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState([]);

  const getData = async () => {
    const [rentalsRes, paymentsRes] = await Promise.all([
      api.get('/rentals'),
      api.get('/payments'),
    ]);

    setRentals(rentalsRes.data);
    setPayments(paymentsRes.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const getTotalPaidForRental = rentalId => {
    return payments
      .filter(p => p.rental === rentalId)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <div className="container">
      <h2>Resumen Financiero</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Total Alquiler</th>
            <th>Total Pagado</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map(r => {
            const paid = getTotalPaidForRental(r._id);
            console.log(r);           
            return (
              <tr key={r._id}>
                <td>{r.client?.name}</td>
                <td>{r.vehicle?.brand} {r.vehicle?.model}</td>
                <td>${r.totalPrice}</td>
                <td>${paid}</td>
                <td style={{ color: paid < r.totalPrice ? 'red' : 'green' }}>
                  ${r.totalPrice - paid}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FinanceSummary;
