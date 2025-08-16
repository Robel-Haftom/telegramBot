import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { callNumber, setWinner, updateGameRoom } from "./store/gameSlice";
import BingoBoard from "./BingoBoard";
import BingoCard from "./BingoCard";
import gameService from "./services/gameService";

const GameRoom = ({ selectedCardIndex }) => {
    const dispatch = useDispatch();
    const { gameRoom, selectedCard, calledNumbers, gameStatus } = useSelector(state => state.game);
    const { allBingoCards } = useSelector(state => state.bingoCards);
    const [lastCalledNumber, setLastCalledNumber] = useState(null);
    const [isCheckingWin, setIsCheckingWin] = useState(false);
    const [gameSession, setGameSession] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [markedNumbers, setMarkedNumbers] = useState(new Set());
    const previousCurrentCallRef = useRef(null);

    useEffect(() => {
        // Get the current session code and start polling for updates
        const sessionCode = gameService.getCurrentSessionCode();
        if (sessionCode) {
            // For now, use a mock telegram ID (in real app, this would come from user context)
            const mockTelegramId = 123456789;
            startPolling(sessionCode, mockTelegramId);
        } else {
            // Fallback: poll active session so spectators or non-joined players stay in sync
            const interval = setInterval(async () => {
                try {
                    const updatedSession = await gameService.getActiveGameSession();
                    setGameSession(updatedSession);
                    
                    // Update Redux state with session data
                    dispatch(updateGameRoom({ 
                        activePlayers: updatedSession.playerCount || 0,
                        currentCall: updatedSession.currentCall,
                        gameState: updatedSession.gameActive ? 'calling' : 'waiting'
                    }));
                    
                    if (Array.isArray(updatedSession.calledNumbersOrdered)) {
                        updatedSession.calledNumbersOrdered.forEach((n) => {
                            if (!calledNumbers.includes(n)) dispatch(callNumber(n));
                        });
                        const last = updatedSession.calledNumbersOrdered[updatedSession.calledNumbersOrdered.length - 1];
                        if (last) {
                            setLastCalledNumber(last);
                            previousCurrentCallRef.current = last;
                        }
                    } else if (updatedSession.currentCall) {
                        setLastCalledNumber(updatedSession.currentCall);
                        if (
                            previousCurrentCallRef.current !== updatedSession.currentCall &&
                            !calledNumbers.includes(updatedSession.currentCall)
                        ) {
                            dispatch(callNumber(updatedSession.currentCall));
                            previousCurrentCallRef.current = updatedSession.currentCall;
                        }
                    }
                    if (updatedSession.winner) {
                        dispatch(setWinner(updatedSession.winner));
                        // Check if we have a winner and need to show announcement
                        if (updatedSession.winner && updatedSession.winningCardNumbers) {
                            // Trigger winner announcement in parent component
                            window.dispatchEvent(new CustomEvent('winner-announced', {
                                detail: {
                                    winner: updatedSession.winner,
                                    winningCardNumbers: updatedSession.winningCardNumbers
                                }
                            }));
                        }
                        
                        // Reset marked numbers when there's a winner (new game will start)
                        setMarkedNumbers(new Set());
                    }
                } catch (e) {}
            }, 1000);
            setPollingInterval(interval);
        }

        return () => {
            if (pollingInterval) clearInterval(pollingInterval);
        };
    }, []);

    const startPolling = (sessionCode, telegramId) => {
        const interval = gameService.pollGameUpdates(sessionCode, (updatedSession) => {
            setGameSession(updatedSession);
            
            // Update Redux state with session data
            dispatch(updateGameRoom({ 
                activePlayers: updatedSession.playerCount || 0,
                currentCall: updatedSession.currentCall,
                gameState: updatedSession.gameActive ? 'calling' : 'waiting',
                players: updatedSession.players || []
            }));
            
            // Update from ordered list as the single source of truth
            if (Array.isArray(updatedSession.calledNumbersOrdered)) {
                updatedSession.calledNumbersOrdered.forEach((n) => {
                    if (!calledNumbers.includes(n)) dispatch(callNumber(n));
                });
                const last = updatedSession.calledNumbersOrdered[updatedSession.calledNumbersOrdered.length - 1];
                if (last) {
                    setLastCalledNumber(last);
                    previousCurrentCallRef.current = last;
                }
            } else if (updatedSession.currentCall) {
                setLastCalledNumber(updatedSession.currentCall);
                if (
                    previousCurrentCallRef.current !== updatedSession.currentCall &&
                    !calledNumbers.includes(updatedSession.currentCall)
                ) {
                    dispatch(callNumber(updatedSession.currentCall));
                    previousCurrentCallRef.current = updatedSession.currentCall;
                }
            }
            
            // Check for winner
            if (updatedSession.winner && updatedSession.winningCardNumbers) {
                // Trigger winner announcement in parent component
                window.dispatchEvent(new CustomEvent('winner-announced', {
                    detail: {
                        winner: updatedSession.winner,
                        winningCardNumbers: updatedSession.winningCardNumbers
                    }
                }));
            }
            
            // Check if there's a winner
            if (updatedSession.winner) {
                dispatch(setWinner(updatedSession.winner));
                
                // Reset marked numbers when there's a winner (new game will start)
                setMarkedNumbers(new Set());
            }
        });
        
        setPollingInterval(interval);
    };

    // Number calling is controlled by backend after countdown; no client start
    const startNumberCalling = async () => {};

    const handleBingo = async () => {
        if (!isCheckingWin) {
            setIsCheckingWin(true);
            
            try {
                // For now, use a mock telegram ID (in real app, this would come from user context)
                const mockTelegramId = 123456789;
                
                // Call BINGO through the backend
                const result = await gameService.callBingo(
                    mockTelegramId,
                    allBingoCards[selectedCardIndex].cardCode
                );
                
                if (result.winner) {
                    alert(`🎉 BINGO! ${result.winner} won the game! 🎉`);
                    dispatch(setWinner(result.winner));
                }
                
            } catch (error) {
                // False BINGO - player loses
                alert("❌ False Bingo! You lose the game. The BINGO button will be disabled.");
                
                // Disable the BINGO button for this player by clearing marked numbers
                setMarkedNumbers(new Set());
                
                // Reset checking state
                setIsCheckingWin(false);
            }
        }
    };

    const checkForWin = () => {
        if (!selectedCardIndex || !allBingoCards[selectedCardIndex] || !allBingoCards[selectedCardIndex].numbers) return false;

        const numbers = allBingoCards[selectedCardIndex].numbers;
        const markedNumbersArray = Array.from(markedNumbers);

        // Check rows
        for (let row = 0; row < numbers.length; row++) {
            if (numbers[row].every(cell => markedNumbersArray.includes(cell) || cell === 0)) {
                return true;
            }
        }

        // Check columns
        for (let col = 0; col < numbers[0].length; col++) {
            if (numbers.every(row => markedNumbersArray.includes(row[col]) || row[col] === 0)) {
                return true;
            }
        }

        // Check diagonals
        if (numbers[0][0] && numbers[1][1] && numbers[2][2] && 
            (markedNumbersArray.includes(numbers[0][0]) || numbers[0][0] === 0) && 
            (markedNumbersArray.includes(numbers[1][1]) || numbers[1][1] === 0) && 
            (markedNumbersArray.includes(numbers[2][2]) || numbers[2][2] === 0)) {
            return true;
        }

        if (numbers[0][2] && numbers[1][1] && numbers[2][0] && 
            (markedNumbersArray.includes(numbers[0][2]) || numbers[0][2] === 0) && 
            (markedNumbersArray.includes(numbers[1][1]) || numbers[1][1] === 0) && 
            (markedNumbersArray.includes(numbers[2][0]) || numbers[2][0] === 0)) {
            return true;
        }

        return false;
    };

    const getCurrentPlayerCount = () => {
        return gameSession?.playerCount || 1;
    };

    // Helper function to get color based on BINGO letter
    const getBingoColor = (number) => {
        if (number >= 1 && number <= 15) return 'bg-red-500'; // B
        if (number >= 16 && number <= 30) return 'bg-orange-500'; // I
        if (number >= 31 && number <= 45) return 'bg-yellow-500'; // N
        if (number >= 46 && number <= 60) return 'bg-green-500'; // G
        if (number >= 61 && number <= 75) return 'bg-blue-500'; // O
        return 'bg-gray-500'; // Default
    };

    // Get last 3 called numbers in chronological order (oldest on left, newest on right)
    const getLastThreeCalledNumbers = () => {
        const totalCalled = calledNumbers.length;
        if (totalCalled === 0) return [];
        if (totalCalled === 1) return [calledNumbers[0]];
        if (totalCalled === 2) return [calledNumbers[0], calledNumbers[1]];
        if (totalCalled === 3) return [calledNumbers[0], calledNumbers[1], calledNumbers[2]];
        
        // For 4+ numbers, show the last 3 oldest->newest
        return [
            calledNumbers[totalCalled - 3],
            calledNumbers[totalCalled - 2],
            calledNumbers[totalCalled - 1]
        ];
    };

    return (
        <div className="flex flex-row gap-2 w-full h-full p-2">
            {/* Left Side - Bingo Board */}
            <div className="flex-1">
                <div className="bg-white border-2 border-gray-300 rounded-lg p-2 h-full">
                    <h2 className="text-sm font-bold mb-2 text-center">BINGO BOARD</h2>
                    <BingoBoard onMarkedNumbersChange={setMarkedNumbers} />
                </div>
            </div>

            {/* Right Side - Game Elements Stacked Vertically */}
            <div className="w-64 flex flex-col gap-2">
                {/* Game Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <h3 className="font-semibold text-xs text-blue-800 mb-1">Game Started</h3>
                </div>

                                {/* Current Call Display */}
                <div className="bg-blue-900 text-black p-3 rounded-lg text-center">
                    <div className="text-xs font-bold mb-2 text-white text-center border-b-2 border-white my-1">CURRENT CALL</div>
                    {lastCalledNumber && (
                        <div className="flex justify-center mb-3">
                            <div className="text-center">
                                <div
                                    className={`w-12 h-12 rounded-full ${getBingoColor(lastCalledNumber)} text-white text-lg font-bold flex items-center justify-center shadow-lg border-2 border-white animate-pulse`}
                                    style={{
                                        background: `radial-gradient(circle at 30% 30%, ${getBingoColor(lastCalledNumber).replace('bg-', '') === 'red-500' ? '#ef4444' : 
                                                                                        getBingoColor(lastCalledNumber).replace('bg-', '') === 'orange-500' ? '#f97316' :
                                                                                        getBingoColor(lastCalledNumber).replace('bg-', '') === 'yellow-500' ? '#eab308' :
                                                                                        getBingoColor(lastCalledNumber).replace('bg-', '') === 'green-500' ? '#22c55e' :
                                                                                        getBingoColor(lastCalledNumber).replace('bg-', '') === 'blue-500' ? '#3b82f6' : '#6b7280'}, 70%, ${getBingoColor(lastCalledNumber).replace('bg-', '') === 'red-500' ? '#dc2626' : 
                                                                                                                                                                                                            getBingoColor(lastCalledNumber).replace('bg-', '') === 'orange-500' ? '#ea580c' :
                                                                                                                                                                                                           getBingoColor(lastCalledNumber).replace('bg-', '') === 'yellow-500' ? '#ca8a04' :
                                                                                                                                                                                                           getBingoColor(lastCalledNumber).replace('bg-', '') === 'green-500' ? '#16a34a' :
                                                                                                                                                                                                           getBingoColor(lastCalledNumber).replace('bg-', '') === 'blue-500' ? '#2563eb' : '#4b5563'})`
                                    }}
                                >
                                    {getBingoColor(lastCalledNumber).replace('bg-', '') === 'red-500' ? 'B' : 
                                     getBingoColor(lastCalledNumber).replace('bg-', '') === 'orange-500' ? 'I' :
                                     getBingoColor(lastCalledNumber).replace('bg-', '') === 'yellow-500' ? 'N' :
                                     getBingoColor(lastCalledNumber).replace('bg-', '') === 'green-500' ? 'G' :
                                     getBingoColor(lastCalledNumber).replace('bg-', '') === 'blue-500' ? 'O' : '?'}-{lastCalledNumber}
                                </div>
                            </div>
                        </div>
                    )}
                    {!lastCalledNumber && (
                        <div className="text-lg text-yellow-800 mb-3">Waiting for numbers...</div>
                    )}
                 
                    {/* Last Three Called Numbers as Pool Balls */}
                    <div className="flex justify-start gap-2">
                        {getLastThreeCalledNumbers().map((number, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className={`w-8 h-8 p-1 rounded-full ${getBingoColor(number)} text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white`}
                                    style={{
                                        background: `radial-gradient(circle at 30% 30%, ${getBingoColor(number).replace('bg-', '') === 'red-500' ? '#ef4444' : 
                                                                                        getBingoColor(number).replace('bg-', '') === 'orange-500' ? '#f97316' :
                                                                                        getBingoColor(number).replace('bg-', '') === 'yellow-500' ? '#eab308' :
                                                                                        getBingoColor(number).replace('bg-', '') === 'green-500' ? '#22c55e' :
                                                                                        getBingoColor(number).replace('bg-', '') === 'blue-500' ? '#3b82f6' : '#6b7280'}, 70%, ${getBingoColor(number).replace('bg-', '') === 'red-500' ? '#dc2626' : 
                                                                                                                                                                                                            getBingoColor(number).replace('bg-', '') === 'orange-500' ? '#ea580c' :
                                                                                                                                                                                                           getBingoColor(number).replace('bg-', '') === 'yellow-500' ? '#ca8a04' :
                                                                                                                                                                                                           getBingoColor(number).replace('bg-', '') === 'green-500' ? '#16a34a' :
                                                                                                                                                                                                           getBingoColor(number).replace('bg-', '') === 'blue-500' ? '#2563eb' : '#4b5563'})`
                                    }}
                                >
                                    {getBingoColor(number).replace('bg-', '') === 'red-500' ? 'B' : 
                                     getBingoColor(number).replace('bg-', '') === 'orange-500' ? 'I' :
                                     getBingoColor(number).replace('bg-', '') === 'yellow-500' ? 'N' :
                                     getBingoColor(number).replace('bg-', '') === 'green-500' ? 'G' :
                                     getBingoColor(number).replace('bg-', '') === 'blue-500' ? 'O' : '?'}-{number}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Player's Bingo Card or Wait/Winning Card */}
                <div className="bg-white border-2 border-gray-300 rounded-lg p-2">
                    <h2 className="text-xs font-bold mb-2 text-center">YOUR CARD</h2>
                    {gameSession?.winningCardNumbers ? (
                        <BingoCard bingoCard={{ cardCode: -1, cardNumbers: gameSession.winningCardNumbers }} />
                    ) : selectedCardIndex !== null && allBingoCards[selectedCardIndex] ? (
                        <BingoCard bingoCard={allBingoCards[selectedCardIndex]} />
                    ) : gameSession?.hasSelectedCard === false ? (
                        <div className="text-xs text-gray-700 text-center py-6">
                            {gameSession?.waitMessage || "Wait until this game is finished"}
                        </div>
                    ) : (
                        <div className="text-xs text-gray-700 text-center py-6">Please wait...</div>
                    )}
                </div>

                {/* Bingo Button */}
                <button
                    onClick={handleBingo}
                    disabled={isCheckingWin || gameSession?.hasSelectedCard === false}
                    className={`
                        w-full p-2 rounded-lg text-white font-bold text-sm transition-all duration-200
                        ${!isCheckingWin && gameSession?.hasSelectedCard !== false
                            ? 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg'
                            : 'bg-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {isCheckingWin ? 'Checking...' : '🎉 BINGO! 🎉'}
                </button>
                
                {/* Marked Numbers Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-600 mb-1">Marked Numbers</div>
                    <div className="text-sm font-semibold text-gray-800">
                        {markedNumbers.size} marked
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {checkForWin() ? '🎯 BINGO possible!' : 'Keep marking numbers'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameRoom;
