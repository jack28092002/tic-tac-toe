import React from "react";
import { useState } from "react";
import "./App.css";

const Square = ({ value, onSquareClick, highlight }) => {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
};

const Board = ({ isX, squares, onPlay, winningSquares }) => {
  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (isX) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "winner :" + winner.winner;
  } else {
    status = "Next Player:" + (isX ? "X" : "O");
  }

  const displaySquare = (i) => {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        highlight={winningSquares.includes(i)}
      />
    );
  };
  const sizeOfBoard = 3;
  let board = [];
  for (let row = 0; row < sizeOfBoard; row++) {
    let squaresRow = [];
    for (let col = 0; col < sizeOfBoard; col++) {
      squaresRow.push(displaySquare(row * sizeOfBoard + col));
    }
    board.push(
      <div key={row} className="board-row">
        {squaresRow}
      </div>
    );
  }
  return (
    <div>
      <div className="status">{status}</div>
      {board}
    </div>
  );
};

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // const currentSquares = history[history.length - 1];
  const [currentMove, setCurrentMove] = useState(0);
  const isX = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascending, setAscending] = useState(true);

  const handlePlay = (nextSquares, location) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  const toggleButton = () => {
    setAscending(!ascending);
  };
  const moves = history.map((squares, move) => {
    let desc;
    if (move > 0) {
      desc = "Go to Move # " + move;
    } else {
      desc = "Go to game Start";
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{desc}</button>
        )}
      </li>
    );
  });
  const sortedMoves = ascending ? moves : moves.reverse();
  const result = calculateWinner(currentSquares);
  const winningSquares = result ? result.line : [];
  return (
    <div className="game">
      <div className="game-board">
        <Board
          isX={isX}
          squares={currentSquares}
          onPlay={handlePlay}
          winningSquares={winningSquares}
        />
      </div>
      <div className="game-history">
        <button onClick={toggleButton}>
          {ascending ? "Sorted in Descending" : "Sorted in Ascending"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
const calculateWinner = (squares) => {
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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
};
