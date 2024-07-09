
import React, { useState, useEffect } from "react";
import axios from "axios";

const PieChart = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pie-chart", {
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
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            {item._id}: {item.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PieChart;
