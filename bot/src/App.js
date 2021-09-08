import logo from "./logo.svg";
import "./App.css";
import { autotrader } from "./autotrader";

//socket.emit("initialise", "Andrea");

function App() {
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
