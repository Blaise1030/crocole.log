import React, {useState} from "react";
import "./index.css";

const App = () => {
  const [number, setNumber] = useState(0);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center select-none">
      <div className="fixed top-0 left-0 w-full bg-blue-500 p-4 text-white shadow">
        <div className="font-bold">Counter App</div>
      </div>
      <div
        className="
        fixed 
        bottom-0 
        right-0 
        bg-blue-500 
        m-3 
        w-16
        h-16 
        text-white
        shadow
        flex
        items-center
        justify-center
        rounded-full
      hover:bg-blue-400
        cursor-pointer"
      >
        <div
          className="font-bold text-xl"
          onClick={() => setNumber(number + 1)}
        >
          +
        </div>
      </div>
      <div className="text-3xl font-bold">{number}</div>
      <div className="flex flex-row">
        <div
          onClick={() => setNumber(number + 1)}
          className="
          m-2 
          bg-blue-500 
          rounded 
          text-white 
          p-2 cursor-pointer           
          hover:bg-blue-400 
          duration-500 "
        >
          + Increase
        </div>
        <div
          onClick={() => setNumber(number - 1)}
          className="
        bg-red-500 
        rounded 
        text-white 
        p-2 
        cursor-pointer 
        m-2 
        hover:bg-red-400 
        duration-500"
        >
          - Decrease
        </div>
      </div>
    </div>
  );
};

export default App;
