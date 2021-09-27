import logo from "./logo.svg";
import "./App.css";
import { autotrade } from "./autotrader";
import { useEffect } from "react";

//socket.emit("initialise", "Andrea");

function App() {
  useEffect(() => {
    const interval = autotrade();
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Trading...</p>
      </header>
    </div>
  );
}

export default App;
