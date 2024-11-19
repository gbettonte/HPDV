import { createSlice } from '@reduxjs/toolkit';

// Creiamo uno slice per gestire la selezione dei dati nel brushing
export const brushSlice = createSlice({
    name: 'brushslice',
    initialState: {
        selectedItems: [], //it contains elements selected by brushing
    },
    reducers: {
        setSelectedItems: (state, action) => {
            state.selectedItems = action.payload; 
        },


        clearSelectedItems: (state) => {
            state.selectedItems = [];
        }
    }
});

export const { setSelectedItems, clearSelectedItems } = brushSlice.actions;

export default brushSlice.reducer;
