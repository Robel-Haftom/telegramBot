import { configureStore } from "@reduxjs/toolkit";
import allBingoCards from "../store/allBingoCardsSlice"
import setSelectedCard from "../store/selectedCardSlice";

const store = configureStore({
    reducer: {
        bingoCards: allBingoCards,
        selectedCard: setSelectedCard
    }
})

export default store;  