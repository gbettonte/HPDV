import './App.css';
import { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { getSeoulBikeData } from './redux/DataSetSlice';
import ControlBar from './components/ControlBar/ControlBar';
import ScatterplotContainer from "./components/scatterplot/ScatterplotContainer";
import ScatterplotBrush from "./components/brush_scatterplot/ScatterplotBrush";

// a component is a piece of code which render a part of the user interface
function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    console.log("App useEffect");
  })

  // called once the component did mount
  useEffect(()=>{
    // initialize the data from file
    dispatch(getSeoulBikeData());
  },[])

  return (
    <div className="App">
        {console.log("App rendering")}
        <div id="control-bar-container">
          <ControlBar/>
        </div>  
        <div id="view-container" className="row">
          <ScatterplotContainer/>
          <ScatterplotBrush/>
          {/* <YourVisContainer/> */}
        </div>
    </div>
  );
}

export default App;
