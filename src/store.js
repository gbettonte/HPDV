import { configureStore } from '@reduxjs/toolkit'
import dataSetReducer from './redux/DataSetSlice'
import controlBarReducer from './redux/ControlBarSlice'
export default configureStore({
  reducer: {
    dataSet: dataSetReducer,
    controlbar: controlBarReducer
    }
})