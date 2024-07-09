
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Initialize from "./components/Initialize";
import Transactions from "./components/Transactions";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import Combined from "./components/Combined";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/initialize" component={Initialize} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/bar-chart" component={BarChart} />
        <Route path="/pie-chart" component={PieChart} />
        <Route path="/combined" component={Combined} />
      </Switch>
    </Router>
  );
}

export default App;
