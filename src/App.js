import './App.css';
import { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { getSeoulBikeData } from './redux/DataSetSlice';
import ControlBar_year from './components/ControlBar/ControlBar_year';
import ControlBar from './components/ControlBar/ControlBar';
import CalendarChart from './components/Calendar/Calendar';

import ScatterplotContainer from "./components/scatterplot/ScatterplotContainer";
import ScatterplotBrush from "./components/brush_scatterplot/ScatterplotBrush";
import ScatterplotZoomContainer from "./components/zoom_scatterplot/ScatterplotZoomContainer";

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
 
        <div id="text-container" className="text-container">
        <h1>Seul Bike Dataset</h1>
        <p>
          Code: <a href="https://github.com/gbettonte/HPDV/tree/my_branhc_giorgio">Giorgio_Bettonte_Github</a>.
        </p>
        <p>
          It is possible to select variables with the controlbar. <br />
          The third scatterplot allows to brush; the most left-one highlight the selected items, while the central scatterplot displays a zoom on that items<br />
           Colors mapping: Yellow = Summer; Green = Autumn; Red = winter; Blue = Spring
        </p>
      </div>
      <div id="control-bar-container">
          <ControlBar/>
        </div> 
        <div id="view-container" className="row">
          <ScatterplotContainer />
          <ScatterplotZoomContainer/>
          <ScatterplotBrush/>
        </div>
        
  
    </div>
  );
}

export default App;