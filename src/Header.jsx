import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateGameRoom, debugState } from "./store/gameSlice"

const Header = () => {
    const dispatch = useDispatch();
    const {gameStatus, startCountDown, callNumber, derash, players, calledNumbers} = useSelector(state => state.game)
    const { activePlayers } = useSelector(state => state.game.gameRoom);
    const [time, setTime] = useState(startCountDown);
    const [backendPlayerCount, setBackendPlayerCount] = useState(0);

    // Use gameRoom.activePlayers for player count, fallback to backend count
    const playerCount = activePlayers || backendPlayerCount || 0;
    
    // Debug logging for Redux state
    console.log('Header - Redux state debug:', {
        gameStatus,
        activePlayers,
        playerCount
    });
    

    // Countdown effect
    useEffect(() => {
        if (gameStatus === "waiting") {
            setTime(startCountDown); // reset timer if gameStatus changes
            const interval = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
    
            return () => clearInterval(interval);
        }
    }, [gameStatus, startCountDown]);

    // Function to manually refresh session data
    const refreshSessionData = async () => {
        try {
            console.log('Header - Manually refreshing session data...');
            const res = await fetch('http://localhost:8080/games/active');
            if (res.ok) {
                const session = await res.json();
                console.log('Header - Refreshed session data:', session);
                console.log('Header - Player count from backend:', session.playerCount);
                
                if (typeof session.playerCount === 'number') {
                    // Update Redux state with player count
                    console.log('Header - Updating Redux with player count:', session.playerCount);
                    dispatch(updateGameRoom({ 
                        activePlayers: session.playerCount,
                        players: session.players || []
                    }));
                    
                    // Also update local state as fallback
                    setBackendPlayerCount(session.playerCount);
                    console.log('Header - Updated backend player count:', session.playerCount);
                }
            }
        } catch (error) {
            console.error('Header - Error refreshing session:', error);
        }
    };

    // Function to force refresh session from backend
    const forceRefreshSession = async () => {
        try {
            console.log('Header - Force refreshing session from backend...');
            // Get the current session code from the URL or Redux state
            const res = await fetch('http://localhost:8080/games/active');
            if (res.ok) {
                const session = await res.json();
                const sessionCode = session.sessionCode;
                
                // Call the force refresh endpoint
                const refreshRes = await fetch(`http://localhost:8080/debug/refresh-session/${sessionCode}`, {
                    method: 'POST'
                });
                
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    console.log('Header - Force refresh response:', refreshData);
                    
                    // Update the UI with the refreshed data
                    if (typeof refreshData.playerCount === 'number') {
                        dispatch(updateGameRoom({ 
                            activePlayers: refreshData.playerCount,
                            players: refreshData.players || []
                        }));
                        setBackendPlayerCount(refreshData.playerCount);
                        console.log('Header - Updated with force refresh data:', refreshData.playerCount);
                    }
                } else {
                    console.error('Header - Force refresh failed:', refreshRes.status);
                }
            }
        } catch (error) {
            console.error('Header - Error force refreshing session:', error);
        }
    };

    useEffect(() => {
        let poll;
        // Poll server for player count during both card selection and game phases
        poll = setInterval(async () => {
            try {
                const res = await fetch('http://localhost:8080/games/active');
                if (res.ok) {
                    const session = await res.json();
                    console.log('Header - Received session data:', session);
                    console.log('Header - Player count from backend:', session.playerCount);
                    
                    if (typeof session.playerCount === 'number') {
                        // Update Redux state with player count
                        console.log('Header - Updating Redux with player count:', session.playerCount);
                        dispatch(updateGameRoom({ 
                            activePlayers: session.playerCount,
                            players: session.players || []
                        }));
                        
                        // Also update local state as fallback
                        setBackendPlayerCount(session.playerCount);
                        console.log('Header - Updated backend player count:', session.playerCount);
                    }
                }
            } catch (error) {
                console.error('Header - Error fetching session:', error);
            }
        }, 2000);
        
        return () => { if (poll) clearInterval(poll); };
    }, [dispatch]);

  return (
    <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg shadow-lg mb-2'>
        {
            gameStatus == "playing" ? (
                <div className='flex justify-between items-center gap-2'>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg p-1 text-center border border-white/30 shadow-md hover:bg-white/30 transition-all duration-300 flex-1'>
                        <div className='text-blue-100 text-xs font-medium'>Derash</div>
                        <div className='text-sm font-bold text-yellow-300'>{derash} birr</div>
                    </div>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg p-1 text-center border border-white/30 shadow-md hover:bg-white/30 transition-all duration-300 flex-1 relative'>
                        <div className='text-blue-100 text-xs font-medium'>Players</div>
                        <div className='text-sm font-bold text-green-300'>{playerCount}</div>
                    </div>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg p-1 text-center border border-white/30 shadow-md hover:bg-white/30 transition-all duration-300 flex-1'>
                        <div className='text-blue-100 text-xs font-medium'>Bet</div>
                        <div className='text-sm font-bold text-blue-200'>10 birr</div>
                    </div>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg p-1 text-center border border-white/30 shadow-md hover:bg-white/30 transition-all duration-300 flex-1'>
                        <div className='text-blue-100 text-xs font-medium'>Calls</div>
                        <div className='text-sm font-bold text-purple-300'>{(calledNumbers && calledNumbers.length) || 0}</div>
                    </div>
                </div>
            ) : (
                <div className='flex justify-between items-center gap-2'>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30 shadow-md hover:bg-white/30 transition-all duration-300 flex-1'>
                        <div className='text-blue-100 text-xs font-medium'>Countdown</div>
                        <div className='text-sm font-bold text-red-300 animate-pulse'>{time}</div>
                    </div>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30 shadow-md hover:bg-white/30 transition-all duration-300 flex-1'>
                        <div className='text-blue-100 text-xs font-medium'>Wallet</div>
                        <div className='text-sm font-bold text-green-300'>50</div>
                    </div>
                    <div className='bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30 shadow-md hover:bg-white/30 transition-all duration-300 flex-1'>
                        <div className='text-blue-100 text-xs font-medium'>Stake</div>
                        <div className='text-sm font-bold text-yellow-300'>10 birr</div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default Header