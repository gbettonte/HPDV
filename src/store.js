import { configureStore } from '@reduxjs/toolkit'
import dataSetReducer from './redux/DataSetSlice'
import controlBarReducer from './redux/ControlBarSlice'
import brushReducer from './redux/BrushSlice'
export default configureStore({
  reducer: {
    dataSet: dataSetReducer,
    controlbar: controlBarReducer,
    brushslice: brushReducer,  
    }
})