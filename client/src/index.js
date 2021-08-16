import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Screen(props) {
  return <button className="screen">{props.output}</button>;
}

function LongScreen(props) {
  return <button className="long-screen">{props.output}</button>;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function StatusButton(props) {
  return (
    <button className="statusbutton" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Tile(props) {
  return (
    <button className="rectangle" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ExtraFunctions(props) {
  //console.log(props.scientificMode);
  const renderTile = (i) => {
    return <Tile value={i} onClick={() => props.onClick(i)} />;
  };

  if (props.scientificMode === false) {
    return null;
  } else {
    return (
      <div>
        <div className="board-row">
          {renderTile("sin")}
          {renderTile("cos")}
          {renderTile("tan")}
        </div>
        <div className="board-row">
          {renderTile("asin")}
          {renderTile("acos")}
          {renderTile("atan")}
        </div>
        <div className="board-row">
          {renderTile("\u03C0")}
          {renderTile("e")}
          {renderTile("exp")}
        </div>
        <div className="board-row">
          {renderTile("(")}
          {renderTile(")")}
          {renderTile("ln")}
        </div>
      </div>
    );
  }
}

function Board(props) {
  /*useEffect(() => {
    console.log(props);
  }, [props]);*/
  const nextMode = props.scientificMode ? "Simple" : "Scientific";

  const renderSquare = (i) => {
    return <Square value={i} onClick={() => props.onClick(i)} />;
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare("C")}
        {renderSquare("\u232B")}
        <StatusButton onClick={() => props.changeMode()} value={nextMode} />
      </div>
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
        {renderSquare(".")}
        {renderSquare(0)}
        {renderSquare("=")}
        {renderSquare("-")}
      </div>
    </div>
  );
}

function Game() {
  const [output, setOutput] = useState([]);
  const [scientificMode, setScientificMode] = useState(false);

  const renderScreen = (output, scientificMode) => {
    if (scientificMode) {
      return <LongScreen output={output} />;
    } else {
      return <Screen output={output} />;
    }
  };

  const handleClick = (i) => {
    const operations = ["", "C", "\u232B", "=", "+", "-", "/", "*", "(", ")"];
    const trigyOperations = [
      "sin",
      "cos",
      "tan",
      "asin",
      "acos",
      "atan",
      "exp",
      "ln",
    ];
    let currentOutput = output;
    if (i === "C") {
      currentOutput = [];
    } else if (i === "\u232B") {
      currentOutput = currentOutput.slice(0, currentOutput.length - 1);
    } else if (i === "=") {
      let sum = calculateValue(output);
      currentOutput = [sum];
    } else if (operations.find((item) => item === i) !== undefined) {
      currentOutput = currentOutput.concat([i]);
    } else if (trigyOperations.find((item) => item === i) !== undefined) {
      currentOutput = currentOutput.concat([i, "("]);
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
    //console.log(currentOutput);
  };

  return (
    <div className="calculator">
      <div>
        <div className="screen">
          {renderScreen(output.join(""), scientificMode)}
        </div>
      </div>
      <div className="game">
        <div className="main-functions">
          <Board
            output={output}
            scientificMode={scientificMode}
            changeMode={() => setScientificMode(!scientificMode)}
            onClick={(i) => handleClick(i)}
          />
        </div>
        <div className="extra-functions">
          <ExtraFunctions
            scientificMode={scientificMode}
            changeMode={() => setScientificMode(!scientificMode)}
            onClick={(i) => handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{}</div>
          <ol>{}</ol>
        </div>
      </div>
    </div>
  );
}

function calculateValue(output) {
  try {
    for (let i = 0; i < output.length; i++) {
      if (output[i] === "\u03C0") {
        output[i] = "3.142";
      } else if (output[i] === "e") {
        output[i] = "2.718";
      }
    }
    for (var i = 0; i < output.length; i++) {
      if (output[i] === ")") {
        break;
      } else if (output[i] === "(") {
        var reversed = [...output];
        reversed.reverse();
        const closeBracket =
          output.length - reversed.findIndex((item) => item === ")");
        const expressionLength = closeBracket - i;
        console.log(i);
        console.log(expressionLength);
        const newOutput = output.slice(i + 1, i + expressionLength - 1);
        console.log(newOutput);
        const newValue = calculateValue(newOutput);
        console.log(newValue);
        output.splice(i, expressionLength, newValue);
      }
    }
    for (let i = 0; i < output.length; i++) {
      if (output[i] === "sin") {
        output[i] = Math.sin(Number(output[i + 1]));
        output.splice(i + 1, 1);
      } else if (output[i] === "cos") {
        output[i] = Math.cos(Number(output[i + 1]));
        output.splice(i + 1, 1);
      } else if (output[i] === "tan") {
        output[i] = Math.tan(Number(output[i + 1]));
        output.splice(i + 1, 1);
      } else if (output[i] === "asin") {
        output[i] = Math.asin(Number(output[i + 1]));
        output.splice(i + 1, 1);
      } else if (output[i] === "acos") {
        output[i] = Math.acos(Number(output[i + 1]));
        output.splice(i + 1, 1);
      } else if (output[i] === "atan") {
        output[i] = Math.atan(Number(output[i + 1]));
        output.splice(i + 1, 1);
      } else if (output[i] === "exp") {
        output[i - 1] = Number(output[i - 1]) ** Number(output[i + 1]);
        output.splice(i, 2);
        i--;
      } else if (output[i] === "ln") {
        output[i] = Math.log(Number(output[i + 1]));
        output.splice(i + 1, 1);
        i--;
      }
    }
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
    throw err;
    return "Err";
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
