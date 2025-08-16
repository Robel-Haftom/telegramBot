class GameService {
    constructor() {
        this.baseUrl = 'http://localhost:8080';
        this.playerId = null;
        this.isConnected = false;
        this.currentSessionCode = null;
    }

    // Connect to Spring Boot backend
    async connect() {
        try {
            // Test connection by calling the hello endpoint
            const response = await fetch(`${this.baseUrl}/games/hello`);
            if (response.ok) {
                this.isConnected = true;
                console.log('Connected to Spring Boot backend');
                return true;
            } else {
                console.error('Failed to connect to backend');
                return false;
            }
        } catch (error) {
            console.error('Connection error:', error);
            this.isConnected = false;
            return false;
        }
    }

    disconnect() {
        this.isConnected = false;
        console.log('Disconnected from Spring Boot backend');
    }

    // Get all bingo cards from Spring Boot backend
    async getBingoCards() {
        try {
            const response = await fetch(`${this.baseUrl}/games/start`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch bingo cards');
            }
        } catch (error) {
            console.error('Error fetching bingo cards:', error);
            throw error;
        }
    }

    // Join a game with selected card
    async joinGame(telegramId, selectedCardCode, cardNumbers) {
        try {
            const response = await fetch(`${this.baseUrl}/games/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramId: telegramId,
                    selectedCardCode: selectedCardCode,
                    cardNumbers: cardNumbers
                })
            });
            
            if (response.ok) {
                const gameSession = await response.json();
                this.currentSessionCode = gameSession.sessionCode;
                return gameSession;
            } else {
                let errorMessage = 'Failed to join game';
                try {
                    const errorText = await response.text();
                    console.error('Backend error response:', errorText);
                    errorMessage = errorText;
                } catch (e) {
                    console.error('Could not read error response:', e);
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                error.response = response;
                throw error;
            }
        } catch (error) {
            console.error('Error joining game:', error);
            throw error;
        }
    }

    // Get current game session status
    async getGameSession(sessionCode) {
        try {
            const response = await fetch(`${this.baseUrl}/games/session/${sessionCode}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to get game session');
            }
        } catch (error) {
            console.error('Error getting game session:', error);
            throw error;
        }
    }

    // Get current game session status with user context
    async getGameSessionWithUser(sessionCode, telegramId) {
        try {
            const response = await fetch(`${this.baseUrl}/games/session/${sessionCode}/user/${telegramId}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to get game session with user context');
            }
        } catch (error) {
            console.error('Error getting game session with user context:', error);
            throw error;
        }
    }

    // Get active game session (single source of truth for countdown/phase)
    async getActiveGameSession() {
        try {
            let response = await fetch(`${this.baseUrl}/games/active`);
            if (response.ok) {
                return await response.json();
            }
            // If not found, attempt to initialize a session by fetching cards, then retry
            if (response.status === 404) {
                try {
                    await this.getBingoCards();
                } catch (_) {}
                response = await fetch(`${this.baseUrl}/games/active`);
                if (response.ok) {
                    return await response.json();
                }
            }
            // Try session endpoint if we have a session code
            if (this.currentSessionCode) {
                try {
                    return await this.getGameSession(this.currentSessionCode);
                } catch (_) {}
            }
            throw new Error('Failed to get active game session');
        } catch (error) {
            console.error('Error getting active game session:', error);
            throw error;
        }
    }

    // Call BINGO
    async callBingo(telegramId, selectedCardCode) {
        try {
            const response = await fetch(`${this.baseUrl}/games/bingo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramId: telegramId,
                    selectedCardCode: selectedCardCode
                })
            });
            
            if (response.ok) {
                return await response.json();
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (error) {
            console.error('Error calling BINGO:', error);
            throw error;
        }
    }

    // Start number calling (for testing)
    async startNumberCalling(sessionCode) {
        try {
            const response = await fetch(`${this.baseUrl}/games/start-calling/${sessionCode}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                return await response.text();
            } else {
                throw new Error('Failed to start number calling');
            }
        } catch (error) {
            console.error('Error starting number calling:', error);
            throw error;
        }
    }

    // Register user with Spring Boot backend
    async registerUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                const result = await response.text();
                console.log('User registration successful:', result);
                return result;
            } else {
                let errorMessage = 'Failed to register user';
                try {
                    const errorText = await response.text();
                    console.error('Registration error response:', errorText);
                    errorMessage = errorText;
                } catch (e) {
                    console.error('Could not read registration error response:', e);
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
                
                const error = new Error(errorMessage);
                error.status = response.status;
                error.response = response;
                throw error;
            }
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    // Get user by Telegram ID
    async getUserByTelegramId(telegramId) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${telegramId}`);
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // Poll for game updates
    async pollGameUpdates(sessionCode, callback, telegramId = null) {
        if (!sessionCode) return;
        
        const pollInterval = setInterval(async () => {
            try {
                let gameSession;
                if (telegramId) {
                    // Use user context endpoint if we have telegram ID
                    gameSession = await this.getGameSessionWithUser(sessionCode, telegramId);
                } else {
                    // Fallback to regular endpoint
                    gameSession = await this.getGameSession(sessionCode);
                }
                callback(gameSession);
                
                // Stop polling if game is completed
                if (gameSession.winner || !gameSession.gameActive) {
                    clearInterval(pollInterval);
                }
            } catch (error) {
                console.error('Error polling game updates:', error);
                clearInterval(pollInterval);
            }
        }, 1000); // Poll every second
        
        return pollInterval;
    }

    getCurrentSessionCode() {
        return this.currentSessionCode;
    }

    getPlayerId() {
        return this.playerId;
    }

    getConnectionStatus() {
        return this.isConnected;
    }
}

export default new GameService();
