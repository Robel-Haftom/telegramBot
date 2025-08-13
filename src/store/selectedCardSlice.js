import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const selectedCard = createSlice({
    name: "selectedCard",
    initialState,
    reducers: {
        setSelectedCard: (state, action) =>{
            return action.payload
        }
    }
})


export const { setSelectedCard } = selectedCard.actions;     
export default selectedCard.reducer;
