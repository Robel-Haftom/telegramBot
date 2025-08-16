import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gameStatus: "waiting", // waiting, cardSelection, playing, completed
    startCountDown: 30,
    winCountDown: 10,
    callNumber: 0,
    derash: 0,
    players: 0,
    calledNumbers: [],
    gameStarted: false,
    winner: null,
    currentPhase: "cardSelection", // cardSelection, gameRoom
    selectedCard: null,
    playerId: null,
    isConnected: false,
    gameRoom: {
        players: [],
        activePlayers: 0,
        currentCall: null,
        bingoBoard: [],
        gameState: "waiting" // waiting, calling, checking
    }
}

const gameSlice = createSlice({
    name: "gameSlice",
    initialState,
    reducers: {
        setGameCompleted: () => initialState,
        startGame: (state, action) =>{
            state.gameStatus = "playing"
            state.startCountDown = 0
            state.winCountDown = 0
            state.derash = action.payload.derash || 0
            state.players = action.payload.players || 0
            state.gameStarted = true
            state.calledNumbers = []
            state.winner = null
            state.currentPhase = "gameRoom"
        },
        callNumber: (state, action) => {
            const number = action.payload
            if (!state.calledNumbers.includes(number)) {
                state.calledNumbers.push(number)
                state.callNumber = number
            }
        },
        setWinner: (state, action) => {
            state.winner = action.payload
            state.gameStatus = "completed"
        },
        resetGame: () => initialState,
        setCardSelectionPhase: (state) => {
            state.currentPhase = "cardSelection"
            state.startCountDown = 30
            state.gameStatus = "waiting"
            state.gameStarted = false
            state.calledNumbers = []
            state.winner = null
        },
        setGameRoomPhase: (state) => {
            state.currentPhase = "gameRoom"
            state.gameStatus = "playing"
            state.gameStarted = true
            state.startCountDown = 0
        },
        setSelectedCard: (state, action) => {
            state.selectedCard = action.payload
        },
        setPlayerId: (state, action) => {
            state.playerId = action.payload
        },
        setConnectionStatus: (state, action) => {
            state.isConnected = action.payload
        },
        updateGameRoom: (state, action) => {
            state.gameRoom = { ...state.gameRoom, ...action.payload }
        },
        updateBingoBoard: (state, action) => {
            state.gameRoom.bingoBoard = action.payload
        },
        markNumberOnCard: (state, action) => {
            if (state.selectedCard && state.selectedCard.numbers) {
                const { number } = action.payload
                // Mark the number on the selected card
                state.selectedCard.numbers = state.selectedCard.numbers.map(row =>
                    row.map(cell => 
                        cell === number ? { ...cell, marked: true } : cell
                    )
                )
            }
        },
        decrementCountdown: (state) => {
            if (state.startCountDown > 0) {
                state.startCountDown -= 1
            }
        },
        updateCountdown: (state, action) => {
            state.startCountDown = action.payload
        },
        debugState: (state, action) => {
            console.log('Redux State Debug:', {
                gameStatus: state.gameStatus,
                gameRoom: state.gameRoom,
                activePlayers: state.gameRoom.activePlayers
            });
        }
    }
})

export const {
    setGameCompleted, 
    startGame, 
    callNumber, 
    setWinner, 
    resetGame,
    setCardSelectionPhase,
    setGameRoomPhase,
    setSelectedCard,
    setPlayerId,
    setConnectionStatus,
    updateGameRoom,
    updateBingoBoard,
    markNumberOnCard,
    decrementCountdown,
    updateCountdown,
    debugState
} = gameSlice.actions;
export default gameSlice.reducer;