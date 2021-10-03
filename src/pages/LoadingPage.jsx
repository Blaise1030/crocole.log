import react from "react";
import gif from "../assets/background.gif";
import {EatLoading} from "react-loadingg";

const Loading = () => {
  return (
    <>
      <div className="bg-black w-screen h-screen font-mono">
        {/* <div
        className="h-full flex items-center justify-center bg-gray-50 bg-cover bg-center "
        style={{backgroundImage: `url(${gif})`}}
      > */}
        <EatLoading height={"20%"} width={"20%"} />
        {/* </div> */}
      </div>
    </>
  );
};
