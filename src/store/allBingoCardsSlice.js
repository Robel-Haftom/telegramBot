import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
    async () =>{
        try {
            const response = await axios.get("http://localhost:8080/games/start");
            return response.data;
        } catch (error) {
            return error.message;
        }
    }
)

export default allBingoCardsSlice.reducer;