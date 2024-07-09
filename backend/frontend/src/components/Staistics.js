
import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistics = () => {
  const [statistics, setStatistics] = useState({});
  const [month, setMonth] = useState("");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("http://localhost:3000/statistics", {
          params: { month },
        });
        setStatistics(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatistics();
  }, [month]);

  return (
    <div>
      <input
        type="text"
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <div>Total Sale Amount: {statistics.totalSaleAmount}</div>
      <div>Total Sold Items: {statistics.totalSoldItems}</div>
      <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
    </div>
  );
};

export default Statistics;
