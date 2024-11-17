import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Papa from "papaparse"

// get the data in asyncThunk
export const getSeoulBikeData = createAsyncThunk('seoulBikeData/fetchData', async () => {
    const response = await fetch('data/SeoulBikeData.csv');
    const responseText = await response.text();
    console.log("loaded file length:" + responseText.length);
    const responseJson = Papa.parse(responseText,{header:true, dynamicTyping:true});
    return responseJson.data.map((item,i)=>{return {...item,index:i}});
    // when a result is returned, extraReducer below is triggered with the case setSeoulBikeData.fulfilled
})

export const dataSetSlice = createSlice({
  name: 'dataSet',
  initialState: {data: []},
  reducers: {
      // add reducer if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSeoulBikeData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSeoulBikeData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;  // I dati caricati vengono salvati nello store
      })
      .addCase(getSeoulBikeData.rejected, (state) => {
        state.status = 'failed';
      });
  }
})

// Action creators are generated for each case reducer function
//export const { updateSelectedItem } = dataSetSlice.actions

export default dataSetSlice.reducer;
