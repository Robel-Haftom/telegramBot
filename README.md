# 🎯 Real-Time Online Bingo Game

A multiplayer real-time Bingo game built with React, Redux, and Spring Boot backend.

## ✨ Features

- **Real-time multiplayer gameplay** - Play with other players online
- **30-second card selection phase** - Choose your Bingo card before the game starts
- **Automatic number calling** - Computer randomly calls numbers every 3 seconds
- **Live game room** - See all called numbers and game state in real-time
- **Bingo verification** - Press the BINGO button when you have a winning pattern
- **Responsive design** - Works on desktop and mobile devices
- **Spring Boot backend** - Robust server-side game logic and data management

## 🚀 Quick Start

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Backend Setup

The frontend is designed to work with the Spring Boot backend running on port 8080.

1. Ensure your Spring Boot backend is running on `http://localhost:8080`
2. The frontend will automatically connect to the backend when you start the game

## 🎮 How to Play

1. **Card Selection Phase (30 seconds)**
   - Choose your Bingo card from the available options
   - If you don't select a card, one will be chosen randomly
   - All players must select within the time limit

2. **Game Room Phase**
   - Watch as numbers are called automatically by the computer
   - Numbers on your card will be marked automatically when called
   - Monitor the Bingo board to see all called numbers

3. **Winning**
   - Get 5 numbers in a row (horizontal, vertical, or diagonal)
   - Click the "🎉 BINGO! 🎉" button to announce your win
   - False BINGO calls result in losing the game

## 🏗️ Architecture

- **Frontend**: React 19 + Redux Toolkit + Tailwind CSS
- **Backend**: Spring Boot + WebSocket + PostgreSQL
- **State Management**: Redux for local state, Spring Boot for server-side logic
- **Real-time Communication**: Spring WebSocket (when implemented)

## 📁 Project Structure

```
src/
├── components/
│   ├── BingoCard.jsx      # Individual Bingo card display
│   ├── BingoBoard.jsx     # Master Bingo board (1-75)
│   ├── CardSelection.jsx  # Card selection phase
│   ├── GameRoom.jsx       # Main game room
│   └── Header.jsx         # Game header
├── store/
│   ├── gameSlice.js       # Game state management
│   ├── allBingoCardsSlice.js # Bingo cards data
│   └── selectedCardSlice.js   # Selected card state
├── services/
│   └── gameService.js     # Spring Boot API communication
└── App.jsx                # Main application component
```

## 🔧 Configuration

The game automatically connects to `http://localhost:8080` for the Spring Boot backend. To change this:

1. Update the server URL in `src/services/gameService.js`
2. Ensure your Spring Boot backend is running on the specified port

## 🎯 Game Rules

- Numbers 1-75 are used (standard Bingo)
- B column: 1-15, I column: 16-30, N column: 31-45, G column: 46-60, O column: 61-75
- Center square (N column, row 3) is a free space
- First player to get 5 in a row wins
- False BINGO calls result in disqualification

## 🚀 Deployment

### Frontend
```bash
npm run build
npm run deploy
```

### Backend
Deploy your Spring Boot application to your preferred hosting service (Heroku, DigitalOcean, AWS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify the Spring Boot backend is running on port 8080
3. Check your network connection
4. Open an issue on GitHub

---

**Happy Bingo! 🎉**
