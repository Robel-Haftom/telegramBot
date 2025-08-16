# 🚀 Setup Guide for Real-Time Bingo Game

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Java 21 (for Spring Boot backend)
- Maven (for Spring Boot build)
- PostgreSQL database

## 🔧 Frontend Setup

✅ Dependencies installed  
✅ Components updated for Spring Boot backend  
✅ Real-time functionality prepared for WebSocket implementation  

## 🖥️ Backend Setup

### Step 1: Start Spring Boot Backend
Ensure your Spring Boot backend is running on port 8080:

```bash
cd ../SpringBack/habeshabingo
mvn spring-boot:run
```

You should see Spring Boot startup messages and the application running on port 8080.

### Step 2: Database Setup
Make sure PostgreSQL is running and the database is configured according to your `application.properties`.

## 🎮 Start the Game

### Terminal 1: Spring Boot Backend
```bash
cd ../SpringBack/habeshabingo
mvn spring-boot:run
```

### Terminal 2: Frontend
```bash
npm run dev
```

## 🌐 Open Your Browser

Navigate to: `http://localhost:5173`

## 🎯 How It Works

1. **Card Selection Phase (30 seconds)**
   - Game automatically starts after 5 seconds
   - Choose your Bingo card
   - Timer counts down from 30 seconds

2. **Game Room Phase**
   - Computer calls numbers every 3 seconds
   - Numbers are marked on your card automatically
   - Press BINGO when you have a winning pattern

## 🔍 Current Status

- ✅ **Bingo Card Generation**: Working with Spring Boot backend
- ✅ **Card Selection**: Functional with local countdown
- ✅ **Game Room**: Basic simulation working
- ⏳ **Real-time Multiplayer**: Pending Spring Boot WebSocket implementation
- ⏳ **Live Number Calling**: Pending WebSocket integration

## 🚨 Troubleshooting

### Frontend Issues
- Check browser console for errors
- Verify Spring Boot backend is running on port 8080
- Ensure all dependencies are installed

### Backend Issues
- Check if port 8080 is available
- Verify PostgreSQL database is running
- Check Spring Boot console for error messages

### Connection Issues
- Frontend tries to connect to `http://localhost:8080`
- Update CORS settings in Spring Boot if needed
- Check firewall/antivirus settings

## 📱 Features

✅ Bingo card generation via Spring Boot API  
✅ 30-second card selection timer  
✅ Basic game simulation  
✅ Live game room with Bingo board  
✅ BINGO button for winners  
✅ Responsive design  
✅ Spring Boot backend integration  
⏳ Real-time multiplayer (WebSocket pending)  

## 🎉 You're Ready!

Your Bingo game is now set up to work with the Spring Boot backend! The basic functionality is working, and real-time multiplayer will be available once Spring Boot WebSocket is implemented. 🎯
