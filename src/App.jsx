import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import BingoCard from "./BingoCard";
import CardSelection from "./CardSelection";
import GameRoom from "./GameRoom";
import Header from "./Header";
import WinnerAnnouncement from "./WinnerAnnouncement";
import { getAllBingoCards } from "./store/allBingoCardsSlice";
import { setCardSelectionPhase, setGameRoomPhase, updateCountdown, updateGameRoom } from "./store/gameSlice";
import gameService from "./services/gameService";

const App = () => {
const dispatch = useDispatch();
const {allBingoCards, status, error} = useSelector(state => state.bingoCards)
const selected = useSelector(state => state.selectedCard)
const {currentPhase} = useSelector(state => state.game)

// Winner announcement state
const [winner, setWinner] = useState(null);
const [winningCardNumbers, setWinningCardNumbers] = useState(null);

  useEffect(() => {
    dispatch(getAllBingoCards())
    
    const initializeGame = async () => {
      try {
        const session = await gameService.getActiveGameSession()
        
        // Update Redux state with session data
        if (session) {
          dispatch(updateGameRoom({ 
            activePlayers: session.playerCount || 0,
            currentCall: session.currentCall,
            gameState: session.gameActive ? 'calling' : 'waiting',
            players: session.players || []
          }));
        }
        
        if (session?.phase === 'cardSelection') {
          dispatch(setCardSelectionPhase())
          if (typeof session.countdown === 'number') {
            dispatch(updateCountdown(session.countdown))
          }
          // Clear winner announcement when entering card selection phase
          setWinner(null);
          setWinningCardNumbers(null);
        } else if (session?.phase === 'gameRoom') {
          dispatch(setGameRoomPhase())
          // Check for winner when in game room phase
          if (session.winner && !winner) {
            setWinner(session.winner);
            setWinningCardNumbers(session.winningCardNumbers);
          }
        } else {
          dispatch(setCardSelectionPhase())
        }
      } catch (e) {
        // Fallback to selection phase if backend not reachable
        dispatch(setCardSelectionPhase())
      }
    }
    
    initializeGame()
  }, [dispatch, winner])
  
  // Listen for winner announcements from GameRoom
  const handleWinnerAnnounced = useCallback((event) => {
    const { winner: winnerName, winningCardNumbers: cardNumbers } = event.detail;
    setWinner(winnerName);
    setWinningCardNumbers(cardNumbers);
  }, []);
  
  useEffect(() => {
    window.addEventListener('winner-announced', handleWinnerAnnounced);
    return () => {
      window.removeEventListener('winner-announced', handleWinnerAnnounced);
    };
  }, [handleWinnerAnnounced])

return(
<div className="flex flex-col gap-1 p-2 w-full h-screen">
  <Header />
  {status === "pending" && (
    <div className="flex items-center justify-center h-full">
      <div className="text-xl">Loading bingo cards...</div>
    </div>
  )}
  {status === "failed" && (
    <div className="flex items-center justify-center h-full">
      <div className="text-xl text-red-600">Error: {error}</div>
    </div>
  )}
  {status === "succeeded" && (
    <>
      {currentPhase === "cardSelection" ? (
        <div className="flex flex-col xl:flex-row gap-2 w-full h-full">
          <div className="flex-1 border p-2 rounded-md overflow-y-auto">
            <CardSelection />
          </div>
          <div className="w-full xl:w-96 flex flex-col justify-center items-center gap-4 p-4">
            {selected !== null && allBingoCards[selected] && (
              <>
                <h3 className="text-sm font-semibold text-center">Your Selected Card</h3>
                <BingoCard bingoCard={allBingoCards[selected]}/>
              </>
            )}
          </div>
        </div>
      ) : currentPhase === "gameRoom" ? (
        <GameRoom selectedCardIndex={selected} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-xl">Game loading...</div>
        </div>
      )}
    </>
  )}
  
  {/* Winner Announcement Modal */}
  <WinnerAnnouncement 
    winner={winner}
    winningCardNumbers={winningCardNumbers}
    onRestart={() => {
      setWinner(null);
      setWinningCardNumbers(null);
      // Force refresh the game session
      window.location.reload();
    }}
  />
</div>
)
}
export default App
