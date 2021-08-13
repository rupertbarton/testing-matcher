import React, { useState } from "react";
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

function renderScreen(output) {
  return <Screen output={output} />;
}

function renderSquare(i, props) {
  return <Square value={i} onClick={() => props.onClick(i)} />;
}

function Board(props) {
  return (
    <div>
      <div className="screen">{renderScreen(props.output)}</div>
      <div className="board-row">
        {renderSquare(7, props)}
        {renderSquare(8, props)}
        {renderSquare(9, props)}
        {renderSquare("/", props)}
      </div>
      <div className="board-row">
        {renderSquare(4, props)}
        {renderSquare(5, props)}
        {renderSquare(6, props)}
        {renderSquare("*", props)}
      </div>
      <div className="board-row">
        {renderSquare(1, props)}
        {renderSquare(2, props)}
        {renderSquare(3, props)}
        {renderSquare("+", props)}
      </div>
      <div className="board-row">
        {renderSquare("C", props)}
        {renderSquare(0, props)}
        {renderSquare("=", props)}
        {renderSquare("-", props)}
      </div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: [],
      sum: "",
    };
  }

  handleClick(i) {
    const operations = ["", "C", "=", "+", "-", "/", "*"];
    let currentOutput = this.state.output;
    if (i === "C") {
      this.setState({ output: [], sum: "" });
    } else if (i === "=") {
      let sum = calculateValue(this.state.output);
      this.setState({ output: [sum], sum: sum });
    } else if (operations.find((item) => item === i) !== undefined) {
      currentOutput = currentOutput.concat([i]);
      this.setState({ output: currentOutput, sum: currentOutput.join("") });
    } else {
      let previous = currentOutput[currentOutput.length - 1] || "";
      if (operations.find((item) => item === previous) === undefined) {
        currentOutput[currentOutput.length - 1] += i.toString();
      } else {
        currentOutput.push(i.toString());
      }
      this.setState({ output: currentOutput, sum: currentOutput.join("") });
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          {Board({
            output: this.state.output,
            onClick: (i) => this.handleClick(i),
          })}
        </div>
        <div className="game-info">
          <div>{}</div>
          <ol>{}</ol>
        </div>
      </div>
    );
  }
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
