import React, { useState, useEffect } from "react";

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
  const [xIsNext, setXIsNext] = useState(true); // true means player's turn (X)
  const [winner, setWinner] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

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

  // Player clicks a cell
  const handleClick = (index) => {
    if (winner || board[index] || !xIsNext || isThinking) return;

    const newBoard = board.slice();
    newBoard[index] = "X";
    setBoard(newBoard);
    setXIsNext(false); // now AI turn
  };

  // AI picks a random empty cell
  const aiMove = (currentBoard) => {
    const emptyIndices = currentBoard
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((v) => v !== null);

    if (emptyIndices.length === 0) return currentBoard;

    // Simple AI: pick a random empty spot
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    const newBoard = currentBoard.slice();
    newBoard[randomIndex] = "O";
    return newBoard;
  };

  // Effect to let AI play after player moves
  useEffect(() => {
    const newWinner = calculateWinner(board);
    if (newWinner) {
      setWinner(newWinner);
      return;
    }

    if (!board.includes(null)) {
      setWinner("draw");
      return;
    }

    if (!xIsNext) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const newBoard = aiMove(board);
        setBoard(newBoard);
        setXIsNext(true);
        setIsThinking(false);

        const winnerAfterAi = calculateWinner(newBoard);
        if (winnerAfterAi) setWinner(winnerAfterAi);
        else if (!newBoard.includes(null)) setWinner("draw");
      }, 700); // AI "thinking" delay

      return () => clearTimeout(timer);
    }
  }, [board, xIsNext]);

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Tic Tac Toe</h1>

      <div className="grid grid-cols-3 gap-4 w-64">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`w-20 h-20 bg-white rounded-lg shadow-md text-4xl font-extrabold flex items-center justify-center transition
              ${
                cell === "X"
                  ? "text-blue-600"
                  : cell === "O"
                  ? "text-red-600"
                  : "text-gray-400 hover:bg-gray-200"
              }`}
            disabled={!!cell || winner || isThinking || !xIsNext}
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
          : isThinking
          ? "Computer is thinking..."
          : `Your turn (X)`}
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
