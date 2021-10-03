import React, {createContext, useState} from "react";
export const ModalContext = createContext();

const Modal = ({children}) => {
const has
  const inflateModal = () => {};
  return (
    <ModalContext.Provider value={{inflateModal}}>
      <div className="fixed bg-black-100 h-0 w-screen z-10">
        This is the overlay
      </div>
      <div className="fixed">THis is the modal</div>
      <div>{children}</div>
    </ModalContext.Provider>
  );
};

export default Modal;
