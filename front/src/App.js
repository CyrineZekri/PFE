import React from 'react'; 
import {
 
  RouterProvider,
} from "react-router-dom"; 
import router from './routes';//call the router defined in roytes
function App() {
  return <RouterProvider router={router} />;
}

export default App;