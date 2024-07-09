// Combined.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Combined = () => {
  const [data, setData] = useState({});
  const [month, setMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/combined", {
          params: { month },
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div>
      <input
        type="text"
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <div>
        <h3>Transactions</h3>
        <ul>
          {data.transactions?.map((transaction) => (
            <li key={transaction._id}>
              {transaction.title} - {transaction.description} -{" "}
              {transaction.price}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Statistics</h3>
        <div>Total Sale Amount: {data.statistics?.totalSaleAmount}</div>
        <div>Total Sold Items: {data.statistics?.totalSoldItems}</div>
        <div>Total Not Sold Items: {data.statistics?.totalNotSoldItems}</div>
      </div>
      <div>
        <h3>Bar Chart</h3>
        <ul>
          {data.barChart?.map((item) => (
            <li key={item.range}>
              {item.range}: {item.count}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Pie Chart</h3>
        <ul>
          {data.pieChart?.map((item) => (
            <li key={item._id}>
              {item._id}: {item.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Combined;
