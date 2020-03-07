import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }
  
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0
    }
  }
  
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = this.calculateWinner();
    const moves = history.map((_, move) => {
      const clickIndex = this.state.history[move].clickIndex;
      const descreption = move ?
        `Shape: ${move % 2 === 0 ? 'O' : 'X'},
         Line: ${clickIndex % 3 + 1},
         Row: ${Math.floor(clickIndex / 3) + 1}` :
        `Game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{descreption}</button>
        </li>
      )
    });
    const status = (
      winner ?
        `Winner ${winner}` :
        `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    );
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (!(this.calculateWinner() || squares[i])) {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState(
        {
          history: [...history, {squares: squares, clickIndex: i}],
          xIsNext: !this.state.xIsNext,
          stepNumber: this.state.stepNumber + 1
        }
      );
    }
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      history: this.state.history.slice(0, step + 1)
    });
  }
  
  calculateWinner() {
    const squares = this.state.history[this.state.history.length - 1].squares;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);
