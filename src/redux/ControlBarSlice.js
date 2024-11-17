import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Papa from "papaparse"


export const  controlBarSlice = createSlice({
    name: 'controlbar',
    initialState: {
      xAxis: 'RentedBikeCount',  // default yxaxis
      yAxis: 'Temperature',      // default y axis
      data: [],                  // Data
    },
    reducers: {
        setXAxis: (state, action) => {
          state.xAxis = action.payload;
        },
        setYAxis: (state, action) => {
          state.yAxis = action.payload;
        },
        setFilterType: (state, action) => {
          state.filterType = action.payload; // Aggiorna il filtro
        },
      }
});

export const { setXAxis, setYAxis, setFilterType, updateSelectedItem } = controlBarSlice.actions;

export default controlBarSlice.reducer;