import React, {useContext, useEffect} from "react";
import {FcGoogle} from "react-icons/fc/";
import {useHistory} from "react-router";
import {UserContext} from "../context/Authentication";

const LoginPage = () => {
  const {signIn, signInState} = useContext(UserContext);
  const router = useHistory();

  const pushToLog = () => router.push("/logs");
  const pushToLogin = () => router.push("/");

  useEffect(() => {
    signInState(pushToLog, pushToLogin);
  }, []);

  return (
    <div className="h-full w-full">
      <div className="h-full flex items-center justify-center  bg-cover bg-center bg-black"
    style={{
          objectFit: "contain",
          backgroundSize: "100% 100%",
          backgroundImage: `url('https://cdn.discordapp.com/attachments/867684486802964480/894241323920547850/background_Made_with_Clipchamp.gif')`,
        }}
    >
        <div className="max-w-md justify-center align-center w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto "
              src="https://fontmeme.com/permalink/211002/9bb01bac7b715510ffa075b87f64dc28.png"
              alt="logo"
            />
          </div>
          <p className="mt-2 text-center text-xl italic text-white">
            Log in with outer space
          </p>

          <div className=" flex justify-center items-center">
            <button
              className="group relative w-50 flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => signIn(pushToLog, () => {})}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3 ">
                <FcGoogle className="h-6 w-5  text-indigo-600 group-hover:text-indigo-400" />
              </span>
              Google Sign-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
