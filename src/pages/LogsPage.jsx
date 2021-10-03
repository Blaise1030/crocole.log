import React, {useEffect, useState, useContext} from "react";
import {getAllLogs} from "../api";
import {UserContext} from "../context/Authentication";
// import gif from "../assets/background.gif";
import {useHistory} from "react-router-dom";
import {LoopCircleLoading} from "react-loadingg";

const LogsPage = () => {
  const {signout} = useContext(UserContext);
  const [log, setLog] = useState(null);
  const router = useHistory();

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    const allLogs = await getAllLogs();
    setLog(allLogs);
  };

  const goToLog = (id, name) => {
    router.push(`/log/${id}`, {name});
  };

  return (
    <div className="h-full w-full ">
      <div
        className="h-screen w-screen select-none bg-no-repeat pt-10 bg-black"
        style={{
          objectFit: "contain",
          backgroundSize: "100% 100%",
          // backgroundImage: `url(${gif})`,
        }}
      >
        <img
          className="mx-auto h-12 w-auto"
          src="https://fontmeme.com/permalink/211002/4c46c16dcf9026e1c728c34dbcb5081c.png"
          alt="logo"
        />
        <div className=" mt-2 flex justify-center items-center">
          <button
            className="group relative w-30 flex items-center hover:bg-red-500 justify-center py-1 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={signout}
          >
            Sign out
          </button>
        </div>
        <div className="h-full w-full">
          <div className="mt-10 p-2 text-center text-white text-5xl font-bold mb-8">
            Missions
          </div>
          {log ? (
            <div className="w-1/4 m-auto">
              {log.map(({name, id}) => {
                return (
                  <button
                    key={id}
                    onClick={() => goToLog(id, name)}
                    className="
                    bg-gray-900 
                    text-white 
                    font-semibold                     
                    cursor-pointer                     
                    border-gray-400 
                    hover:bg-indigo-900 
                    hover:text-red-600 mb-3
                    py-2
                    rounded
                    shadow
                    px-4
                    border
                    w-full"
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          ) : (
            <LoopCircleLoading />
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
