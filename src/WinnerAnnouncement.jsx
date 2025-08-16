import React from 'react';

const WinnerAnnouncement = ({ winner, winningCardNumbers, onRestart }) => {
    if (!winner) return null;

    const formatBingoCard = (cardNumbers) => {
        if (!cardNumbers || cardNumbers.length === 0) return null;
        
        const headers = ['B', 'I', 'N', 'G', 'O'];
        
        return (
            <div className="grid grid-cols-5 gap-1 text-center">
                {headers.map((header, colIndex) => (
                    <div key={colIndex} className="font-bold text-blue-600 text-sm">
                        {header}
                    </div>
                ))}
                {cardNumbers.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                        <div 
                            key={`${rowIndex}-${colIndex}`} 
                            className={`p-2 border text-sm font-mono ${
                                cell === 0 ? 'bg-gray-200 text-gray-500' : 'bg-white'
                            }`}
                        >
                            {cell === 0 ? 'FREE' : cell}
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-4 text-center">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold text-green-600 mb-2">🎉 BINGO! 🎉</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">We Have a Winner!</h2>
                </div>
                
                <div className="mb-6">
                    <div className="text-xl font-semibold text-blue-600 mb-2">🏆 Winner</div>
                    <div className="text-2xl font-bold text-gray-800">{winner}</div>
                </div>
                
                {winningCardNumbers && (
                    <div className="mb-6">
                        <div className="text-lg font-semibold text-purple-600 mb-3">🎯 Winning Card</div>
                        <div className="inline-block">
                            {formatBingoCard(winningCardNumbers)}
                        </div>
                    </div>
                )}
                
                <div className="mb-6">
                    <div className="text-lg text-gray-600">
                        🎮 The game will restart automatically in a few seconds...
                    </div>
                </div>
                
                <button
                    onClick={onRestart}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    🔄 Restart Game Now
                </button>
            </div>
        </div>
    );
};

export default WinnerAnnouncement;
