import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Papa from "papaparse"


export const  controlBarSlice = createSlice({
    name: 'controlbar',
    initialState: {
      xAxis: 'RentedBikeCount',  // default yxaxis
      yAxis: 'Temperature',      // default y axis
      Year: '2017',
      data: [],                  // Data
    },
    reducers: {
        setXAxis: (state, action) => {
          state.xAxis = action.payload;
        },
        setYAxis: (state, action) => {
          state.yAxis = action.payload;
        },
        setYear: (state, action) => {
          state.Year = action.payload;
        }
      }
});

export const { setXAxis, setYAxis, setYear, updateSelectedItem } = controlBarSlice.actions;

export default controlBarSlice.reducer;