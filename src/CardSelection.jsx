import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCard, setCardSelectionPhase, setGameRoomPhase, updateGameRoom } from "./store/gameSlice";
import { setSelectedCard as setSelectedCardAction } from "./store/selectedCardSlice";
import gameService from "./services/gameService";

const CardSelection = () => {
    const dispatch = useDispatch();
    const { allBingoCards, status } = useSelector(state => state.bingoCards);
    const { currentPhase } = useSelector(state => state.game);
    const [selectedCardCodes, setSelectedCardCodes] = useState([]);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [localCountdown, setLocalCountdown] = useState(30);
    const [isJoiningGame, setIsJoiningGame] = useState(false);
    const [gameSession, setGameSession] = useState(null);

    useEffect(() => {
        // Connect to Spring Boot backend when component mounts
        gameService.connect();
        
        // Poll active session (via active endpoint) to reflect selected cards and countdown from server
        const sessionCode = gameService.getCurrentSessionCode();
        let poll;
        poll = setInterval(async () => {
            try {
                const session = await gameService.getActiveGameSession();
                setGameSession(session); // Store the full game session
                
                // Update Redux state with session data
                dispatch(updateGameRoom({ 
                    activePlayers: session.playerCount || 0,
                    currentCall: session.currentCall,
                    gameState: session.gameActive ? 'calling' : 'waiting',
                    players: session.players || []
                }));
                
                // Update selected card codes for UI display
                if (Array.isArray(session.selectedCardCodes)) {
                    console.log('CardSelection - Received selected card codes:', session.selectedCardCodes);
                    setSelectedCardCodes(session.selectedCardCodes);
                } else {
                    console.log('CardSelection - No selected card codes in session');
                    setSelectedCardCodes([]);
                }
                if (typeof session.countdown === 'number') {
                    setLocalCountdown(session.countdown);
                }
                if (session.phase === 'gameRoom') {
                    dispatch(setGameRoomPhase());
                }
            } catch (e) {}
        }, 1000);

        // For now, we'll use a local countdown since WebSocket is not implemented yet
        // This will be replaced when Spring Boot WebSocket is ready
        let countdownInterval;
        
        // Countdown is driven by backend now; no local decrement

        return () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            if (poll) clearInterval(poll);
        };
    }, [currentPhase]);

    const startGame = async () => {
        // Game start is controlled by backend countdown now
        if (selectedCardIndex !== null) {
            await joinGame(allBingoCards[selectedCardIndex]);
        }
    };

    const joinGame = async (selectedCard) => {
        if (isJoiningGame) return;
        
        setIsJoiningGame(true);
        try {
            // For now, use a mock telegram ID (in real app, this would come from user context)
            const mockTelegramId = 123456789;
            
            // Try to join the game with selected card
            let gameSession;
            try {
                gameSession = await gameService.joinGame(
                    mockTelegramId,
                    selectedCard.cardCode,
                    selectedCard.cardNumbers
                );
            } catch (error) {
                // Check if user is already registered (409 status)
                if (error.status === 409 && error.message && error.message.includes('Already Registered')) {
                    // Don't throw an error, just continue - the user can still play
                    return;
                }
                
                // Check if user not found (handle different error formats)
                if (error.message && (
                    error.message.includes('User not found') || 
                    error.message.includes('User not found with Telegram ID') ||
                    error.message.includes('500') ||
                    error.status === 500
                )) {
                    // Register the user first
                    const userData = {
                        telegramId: mockTelegramId,
                        phoneNumber: '+1234567890',
                        userName: 'testuser',
                        firstName: 'Test',
                        lastName: 'User'
                    };
                    
                    try {
                        const registrationResult = await gameService.registerUser(userData);
                        
                        // Wait a moment for the registration to complete
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Try joining again after registration
                        gameSession = await gameService.joinGame(
                            mockTelegramId,
                            selectedCard.cardCode,
                            selectedCard.cardNumbers
                        );
                    } catch (error) {
                        // Check if it's a registration error or a retry error
                        if (error.message && error.message.includes('Failed to join game')) {
                            console.error('Failed to join game after registration:', error);
                            throw new Error(`Failed to join game after registration: ${error.message}`);
                        } else {
                            console.error('User registration failed:', error);
                            throw new Error(`User registration failed: ${error.message}`);
                        }
                    }
                } else {
                    throw error;
                }
            }
            
            if (Array.isArray(gameSession.selectedCardCodes)) {
                setSelectedCardCodes(gameSession.selectedCardCodes);
            }
            
            // Do not start number calling from client; backend handles after countdown
            
            // Do not change phase here; wait for backend to flip to gameRoom
            
        } catch (error) {
            console.error('Final error in joinGame:', error);
            alert('Failed to join game: ' + error.message);
        } finally {
            setIsJoiningGame(false);
        }
    };

    const handleCardSelect = async (index) => {
        const card = allBingoCards[index];
        if (!card) return;
        // Prevent selecting an already taken card
        if (selectedCardCodes.includes(card.cardCode)) return;
        // Prevent selecting if game is in progress
        if (gameSession?.gameInProgress) return;

        const previousIndex = selectedCardIndex;

        // Try to reserve the card on the backend first
        try {
            await joinGame(card);
            // Update local selection only after successful reservation
            setSelectedCardIndex(index);
            dispatch(setSelectedCardAction(index));
            dispatch(setSelectedCard(card));
        } catch (e) {
            // Revert to previous selection on error
            setSelectedCardIndex(previousIndex);
        }
    };

    if (status === "pending") {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl">Loading bingo cards...</div>
            </div>
        );
    }

    if (currentPhase === "gameRoom") {
        return null; // This component will be hidden when in game room
    }

    return (
        <div className="flex flex-col gap-2">
           
            <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1">
                {allBingoCards.map((card, index) => {
                    const isTaken = selectedCardCodes.includes(card.cardCode);
                    const isSelected = selectedCardIndex === index;
                    
                    return (
                        <div
                            key={index}
                            onClick={() => handleCardSelect(index)}
                            className={`
                                border-2 rounded-lg cursor-pointer transition-all duration-200
                                ${isSelected 
                                    ? 'border-green-500 bg-green-100 scale-105 shadow-lg' 
                                    : isTaken 
                                        ? 'border-red-500 bg-red-100 cursor-not-allowed' 
                                        : 'border-gray-300 hover:border-blue-400 hover:scale-102'
                                }
                                ${localCountdown === 0 || gameSession?.gameInProgress ? 'cursor-not-allowed opacity-50' : ''}
                            `}
                            style={{ 
                                pointerEvents: localCountdown === 0 || isTaken || gameSession?.gameInProgress ? 'none' : 'auto' 
                            }}
                            title={`Card ${card.cardCode} - ${isTaken ? 'Taken' : 'Available'}${isSelected ? ' - Selected' : ''}`}
                        >
                            <div className="p-1 text-center font-semibold text-xs">{index + 1}</div>
                            {isTaken && <div className="text-xs text-red-600">Taken</div>}
                        </div>
                    );
                })}
            </div>
            
            {isJoiningGame && (
                <div className="text-center text-blue-600 font-semibold">
                    Joining game...
                </div>
            )}
            
            {/* Show message if game is in progress and late joins are not allowed */}
            {gameSession?.gameInProgress && (
                <div className="text-center text-red-600 font-semibold p-4 bg-red-50 border border-red-200 rounded-lg">
                    🚫 Game is already in progress!<br/>
                    Please wait for the current game to end before joining.
                </div>
            )}
        </div>
    );
};

export default CardSelection;