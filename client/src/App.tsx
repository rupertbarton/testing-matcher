import React from "react";
import logo from "./logo.svg";
import "./App.css";

import OrderBooks from "./parts/orderBooks/OrderBooks";
import DataDisplay from "./parts/dataDisplay/DataDisplay";
import TradeHistory from "./parts/tradeHistory/TradeHistory";
import Footer from "./parts/footer/Footer";
import Header from "./parts/header/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main">
        <OrderBooks />
        <DataDisplay />
        <TradeHistory />
      </div>
      <Footer />
    </div>
  );
}

export default App;
