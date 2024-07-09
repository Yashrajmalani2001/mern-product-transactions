
import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/transactions", {
          params: { search, page, perPage, month },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactions();
  }, [search, page, perPage, month]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="number"
        placeholder="Page"
        value={page}
        onChange={(e) => setPage(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Per Page"
        value={perPage}
        onChange={(e) => setPerPage(Number(e.target.value))}
      />
      <input
        type="text"
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction._id}>
            {transaction.title} - {transaction.description} -{" "}
            {transaction.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
