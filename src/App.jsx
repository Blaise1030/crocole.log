import initApp from "./firebase";
import React, {useEffect} from "react";
import Authentication from "./context/Authentication";
import "./index.css";
import SpaceRoute from "./Routes";

const App = () => {
  useEffect(initApp);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Authentication>
        <SpaceRoute />;
      </Authentication>
    </div>
  );
};

export default App;
