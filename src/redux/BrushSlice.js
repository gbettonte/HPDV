import { createSlice } from '@reduxjs/toolkit';

// Creiamo uno slice per gestire la selezione dei dati nel brushing
export const brushSlice = createSlice({
    name: 'brushslice',
    initialState: {
        selectedItems: [], // Questo array conterrà i punti selezionati tramite il brushing
    },
    reducers: {
        // Aggiunge gli item selezionati nel brushing allo stato
        setSelectedItems: (state, action) => {
            state.selectedItems = action.payload; // Memorizza i dati selezionati
        },

        // Pulisce la selezione
        clearSelectedItems: (state) => {
            state.selectedItems = [];
        }
    }
});

// Esportiamo le azioni per usarle nei componenti
export const { setSelectedItems, clearSelectedItems } = brushSlice.actions;

export default brushSlice.reducer;
