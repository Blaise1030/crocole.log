import {useState} from "react";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";

export default function Dropdown({dropdownLabel, menuSelections}) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(
    (menuSelections || [])[0].title
  );
  const onMenuSelected = (selectFunction, labelName) => {
    setSelectedLabel(labelName);
    selectFunction();
    setOpen(false);
  };

  return (
    <div className="relative text-white">
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed top-0 left-0 h-full w-full z-10"
        ></div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer p-1 mb-1 border  flex flex-row items-center justify-between w-full lg:w-48 "
      >
        <div className="mr-2 text-sm ml-1">{selectedLabel}</div>
        {open ? (
          <MdKeyboardArrowUp className="text-white" />
        ) : (
          <MdKeyboardArrowDown className="text-white" />
        )}
      </button>

      {open && (
        <div className="z-20 bg-black border p-1  absolute w-full lg:w-48 text-left ">
          {menuSelections
            ?.filter(({title}) => title !== selectedLabel)
            .map(({title, onClick}) => (
              <div
                key={title}
                onClick={() => onMenuSelected(onClick, title)}
                className="p-1 hover:bg-gray-900 rounded cursor-pointer text-sm"
              >
                {title}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
