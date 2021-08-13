import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Screen(props) {
  return <button className="screen">{props.output}</button>;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  useEffect(() => {
    console.log(props);
  }, [props]);

  const renderScreen = (output) => {
    return <Screen output={output} />;
  };

  const renderSquare = (i) => {
    return <Square value={i} onClick={() => props.onClick(i)} />;
  };

  return (
    <div>
      <div className="screen">{renderScreen(props.output.join(""))}</div>
      <div className="board-row">
        {renderSquare(7)}
        {renderSquare(8)}
        {renderSquare(9)}
        {renderSquare("/")}
      </div>
      <div className="board-row">
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare("*")}
      </div>
      <div className="board-row">
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare("+")}
      </div>
      <div className="board-row">
        {renderSquare("C")}
        {renderSquare(0)}
        {renderSquare("=")}
        {renderSquare("-")}
      </div>
    </div>
  );
}

function Game() {
  const [output, setOutput] = useState([]);
  const handleClick = (i) => {
    const operations = ["", "C", "=", "+", "-", "/", "*"];
    let currentOutput = output;
    if (i === "C") {
      currentOutput = [];
    } else if (i === "=") {
      let sum = calculateValue(output);
      currentOutput = [sum];
    } else if (operations.find((item) => item === i) !== undefined) {
      currentOutput = currentOutput.concat([i]);
    } else {
      let previous = currentOutput[currentOutput.length - 1] || "";
      if (operations.find((item) => item === previous) === undefined) {
        currentOutput = [...currentOutput];
        currentOutput[currentOutput.length - 1] += i.toString();
      } else {
        currentOutput = [...currentOutput, i.toString()];
      }
    }
    setOutput(currentOutput);
    console.log(currentOutput);
  };

  console.log("85");
  console.log(output);
  return (
    <div className="game">
      <div className="game-board">
        <Board output={output} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{}</div>
        <ol>{}</ol>
      </div>
    </div>
  );
}

function calculateValue(output) {
  try {
    for (let i = 1; i < output.length; i++) {
      if (output[i] === "*") {
        output[i - 1] = Number(output[i - 1]) * Number(output[i + 1]);
        output.splice(i, 2);
        i--;
      } else if (output[i] === "/") {
        output[i - 1] = Number(output[i - 1]) / Number(output[i + 1]);
        output.splice(i, 2);
        i--;
      }
    }
    for (let i = 1; i < output.length; i++) {
      if (output[i] === "+") {
        output[i - 1] = Number(output[i - 1]) + Number(output[i + 1]);
        output.splice(i, 2);
        i--;
      } else if (output[i] === "-") {
        output[i - 1] = Number(output[i - 1]) - Number(output[i + 1]);
        output.splice(i, 2);
        i--;
      }
    }
    return output[0];
  } catch (err) {
    return "Err";
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
