import React, { useState } from "react";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const calculateWinner = (board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (winner || board[index]) return; // ignore if game over or cell filled

    const newBoard = board.slice();
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (!newBoard.includes(null)) {
      setWinner("draw");
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Tic Tac Toe</h1>

      <div className="grid grid-cols-3 gap-4 w-64">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className="w-20 h-20 bg-white rounded-lg shadow-md text-4xl font-extrabold text-gray-800 flex items-center justify-center hover:bg-gray-200 transition"
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="mt-6 text-xl min-h-[1.5rem] text-gray-700">
        {winner === "draw"
          ? "It's a draw!"
          : winner
          ? `Winner: ${winner}`
          : `Next player: ${xIsNext ? "X" : "O"}`}
      </div>

      <button
        onClick={restartGame}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Restart Game
      </button>
    </div>
  );
}
