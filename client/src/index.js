import React from "react";
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

class Board extends React.Component {
  renderScreen(output) {
    return <Screen output={output} />;
  }

  renderSquare(i, onClick = this.onClick) {
    return <Square value={i} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="screen">{this.renderScreen(this.props.output)}</div>
        <div className="board-row">
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare("/")}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare("*")}
        </div>
        <div className="board-row">
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare("+")}
        </div>
        <div className="board-row">
          {this.renderSquare("C")}
          {this.renderSquare(0)}
          {this.renderSquare("=")}
          {this.renderSquare("-")}
        </div>
      </div>
    );
  }
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
          <Board
            output={this.state.output}
            onClick={(i) => this.handleClick(i)}
          />
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
