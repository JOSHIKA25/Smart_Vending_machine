import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/transactions")
      .then(res => setTransactions(res.data));
  }, []);

  return (
    <div>
      <h2>Transactions</h2>

      {transactions.map(t => (
        <div key={t.id}>
          <p><b>{t.product_name}</b></p>
          <p>Quantity: {t.quantity}</p>
          <p>{new Date(t.created_at).toLocaleString()}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Transactions;
