import { configureStore } from "@reduxjs/toolkit";
import allBingoCards from "../store/allBingoCardsSlice"
import setSelectedCard from "../store/selectedCardSlice";
import gameSlice from "../store/gameSlice"

const store = configureStore({
    reducer: {
        bingoCards: allBingoCards,
        selectedCard: setSelectedCard,
        game: gameSlice
    }
})

export default store;  