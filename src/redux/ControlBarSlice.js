import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Papa from "papaparse"


export const  controlBarSlice = createSlice({
    name: 'controlbar',
    initialState: {
      xAxis: 'RentedBikeCount',  // default yxaxis
      yAxis: 'Temperature',      // default y axis
      data: [],                  // Data
      selectedItem: null,        //to store the selected item
    },
    reducers: {
        setXAxis: (state, action) => {
          state.xAxis = action.payload;
        },
        setYAxis: (state, action) => {
          state.yAxis = action.payload;
        },
        updateSelectedItem: (state, action) => {
          state.selectedItem = action.payload;
        }
      }
});

export const { setXAxis, setYAxis, updateSelectedItem } = controlBarSlice.actions;

export default controlBarSlice.reducer;