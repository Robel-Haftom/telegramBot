import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import gameService from "../services/gameService";

const initialState = {
    allBingoCards: [],
    status: "idle",
    error: ""
}

const allBingoCardsSlice = createSlice({
    name:"allBingoCards",
    initialState,
    reducers: {

    },
    extraReducers: builder =>{
        builder
            .addCase(getAllBingoCards.pending, (state) => {
                state.status = "pending"
            })
            .addCase(getAllBingoCards.fulfilled, (state, action) =>{
                state.allBingoCards = action.payload;
                state.status = "succeeded"
            })
            .addCase(getAllBingoCards.rejected, (state, action) =>{
                state.error = action.payload;
                state.status = "failed"
            })
    }
});

export const getAllBingoCards = createAsyncThunk("bingoCards/allBingoCards",
    async (_, { rejectWithValue }) =>{
        try {
            // Use the gameService to get bingo cards from Spring Boot backend
            const bingoCards = await gameService.getBingoCards();
            return bingoCards;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch bingo cards");
        }
    }
)

export default allBingoCardsSlice.reducer;