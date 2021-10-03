import React, {useContext, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import {
  approveMessage,
  getMessages,
  sendsMessage,
  updateMessage,
} from "../api.js";
import {UserContext} from "../context/Authentication";
import {getStorage, ref, uploadString} from "firebase/storage";
import {FiArrowLeftCircle} from "react-icons/fi";
import {BsImageFill} from "react-icons/bs";
import {Popup} from "reactjs-popup";
import Webcam from "react-webcam";
import Dropdown from "../components/Dropdown";

const LogPage = () => {
  const sortByTime = (a, b) => a?.time - b?.time;
  const sortByName = (a, b) => a?.display_name?.localeCompare(b?.display_name);
  const [rstCheckBoxes, setResetCheckboxes] = useState(true);
  const [taggedMessages, setTaggedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filterFunction, setFilterFunction] = useState(() => sortByTime);
  const [input, setInput] = useState("");
  const {user} = useContext(UserContext);

  const {id} = useParams();
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    getMessages(id, (data) => {
      setMessages(data);
      scrollToBotton();
      setFirstScroll(true);
    });
  }, []);

  const sendMessage = ({payload, reference}) => {
    sendsMessage({
      username: user.displayName,
      userId: user.uid,
      payload,
      logId: id,
      type: "text",
      reference,
    });
    setInput("");
    resetCheckBoxes();
    scrollToBotton();
  };

  const addTaggedMessages = (id) => {
    let messages = taggedMessages;
    messages.push(id);
    setTaggedMessages(messages);
  };

  const removeTaggedMessages = (id) => {
    setTaggedMessages(taggedMessages.filter((ids) => ids !== id));
  };

  const resetCheckBoxes = () => {
    setTaggedMessages([]);
    setResetCheckboxes(!rstCheckBoxes);
  };

  const onCheck = (e, id) => {
    e ? addTaggedMessages(id) : removeTaggedMessages(id);
  };

  const scrollToBotton = () => {
    const element = document.getElementById("scroll");
    element.scrollTop = element.scrollHeight;
  };

  return (
    <>
      <div className="bg-black w-screen h-screen font-mono">
        <div className="flex flex-row text-white font-bold p-3 items-center">
          <FiArrowLeftCircle
            type="button"
            className="h-10 w-10"
            onClick={goBack}
          />
          <div className=" text-white text-md pr-4 ml-auto">Sort By:</div>
          <div className="text-md pr-4 mr-6">
            <Dropdown
              menuSelections={[
                {
                  title: "Time",
                  onClick: () => setFilterFunction(() => sortByTime),
                },
                {
                  title: "User",
                  onClick: () => setFilterFunction(() => sortByName),
                },
              ]}
            />
          </div>
          <div className=" text-4xl">{history.location.state.name}</div>
        </div>
        <div className="grid grid-flow-col grid-cols-12 text-white border-b-4 font-extrabold ">
          <div className="col-span-1 p-2 pl-0"> Date</div>
          <div className="col-span-1 p-2 pl-0"> Time</div>
          <div className="col-span-2 p-2 pl-0"> User</div>
          <div className="col-span-6 p-2 pl-0"> Payload</div>
          <div className="col-span-1 p-2 pl-0" onClick={resetCheckBoxes}>
            {taggedMessages?.length > 0 ? "RMV TAGS" : "Tags"}
          </div>
          <div className="col-span-1 p-2 pl-0"> Approval</div>
        </div>
        <div className="h-full overflow-y-auto pb-60" id={"scroll"}>
          {messages
            .sort(filterFunction)
            .map(
              ({
                id,
                time,
                display_name,
                payload,
                approved,
                type,
                user_id,
                tags,
              }) => {
                const date = new Date(time);
                const displayDate =
                  date.getFullYear() +
                  "-" +
                  (date.getMonth() + 1) +
                  "-" +
                  date.getDate();
                const displayTime =
                  date.getHours() +
                  ":" +
                  date.getMinutes() +
                  ":" +
                  date.getSeconds();

                return (
                  <div
                    key={id}
                    className="grid grid-flow-col grid-cols-12 text-white hover:bg-gray-900 items-center"
                  >
                    <div className="col-span-1 p-2 ">{displayDate}</div>
                    <div className="col-span-1 p-2 ">{displayTime}</div>
                    <div className="col-span-2 p-2 ">{display_name}</div>
                    {type === "text" ? (
                      !approved && user_id === user.uid ? (
                        <PopupComponent payload={payload} id={id} />
                      ) : (
                        <div className="col-span-6 text-left ">{payload}</div>
                      )
                    ) : (
                      <img
                        className="round-md col-span-6 rounded-md w-96 mt-3"
                        src={payload}
                        alt={`${payload}`}
                      />
                    )}
                    <div className="col-span-1 p-2  flex flex-row items-center">
                      {approved ? (
                        <CheckboxComponent
                          id={id}
                          showCheckBoxes={rstCheckBoxes}
                          onChange={onCheck}
                        />
                      ) : (
                        <input disabled={true} type="checkbox" />
                      )}
                      <TaggedComponent tags={tags} messages={messages} />
                    </div>
                    <div className="col-span-1 p-2 ">
                      {!approved && user_id === user.uid && (
                        <button
                          type="button"
                          className="p-1 bg-white text-black mt-2 ml-5 rounded"
                          onClick={() => approveMessage(id)}
                        >
                          {"Approve"}
                        </button>
                      )}
                      {approved && (
                        <div className="bg-green-700 text-center">Approved</div>
                      )}
                      {!approved && user_id !== user.uid && (
                        <div className="text-center">Waiting</div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
        </div>
        <div className="fixed bottom-0 left-0 flex flex-row w-full text-white bg-black items-center justify-left border-t-2 ">
          {/* <SpeechToText2></SpeechToText2> */}
          <div className="text-xl p-2"> {">>>"} </div>
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage({payload: input, reference: taggedMessages});
            }}
          >
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="outline-none p-4 text-xl bg-black w-full "
              type="text"
            />
          </form>

          {/* <BsMic size="30px">
            <SpeechToText />
          </BsMic> */}
          {/*  */}
          <CameraPopout user={user} id={id} taggedMessages={taggedMessages} />
        </div>
      </div>
    </>
  );
};

const CheckboxComponent = ({showCheckBoxes, id, onChange}) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [showCheckBoxes]);

  return (
    <input
      onChange={(e) => {
        onChange(!checked, id);
        setChecked(!checked);
      }}
      checked={checked}
      type="checkbox"
    />
  );
};

const CameraPopout = ({user, id, taggedMessages}) => {
  const [open, setOpen] = useState(false);
  const togglePopUp = () => setOpen(!open);
  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width: 200,
    height: 200,
    facingMode: "user",
  };
  const uploadFileAsString = ({file}) => {
    const storage = getStorage();
    const newDate = Date.now();
    const storageRef = ref(storage, `${newDate}`);
    uploadString(storageRef, file, "data_url").then((link) => {
      sendsMessage({
        username: user.displayName,
        userId: user.uid,
        payload: `https://firebasestorage.googleapis.com/v0/b/crocole-log.appspot.com/o/${link.metadata.fullPath}?alt=media&token=821c1353-65e0-4484-86ec-6984c7ea51cd`,
        logId: id,
        type: "image",
        reference: taggedMessages,
      });
    });
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    uploadFileAsString({file: imageSrc});
  }, [webcamRef]);
  return (
    <>
      <BsImageFill onClick={togglePopUp} className="w-8 h-8 mr-10" />
      <Popup open={open}>
        <div className="bg-black p-4 border w-auto h-auto">
          <Webcam
            audio={false}
            height={500}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={videoConstraints}
          />
          <div className="m-full">
            <button onClick={capture} className="bg-white rounded p-1 m-auto">
              Capture photo
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
};
const PopupComponent = ({payload, showCheckBoxes, id}) => {
  const [defaultText, setText] = useState(payload);
  const [open, setOpen] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    updateMessage(id, defaultText);
    togglePopUp();
  };

  const togglePopUp = () => setOpen(!open);

  return (
    <>
      <button onClick={togglePopUp} className="col-span-6 p-2 text-left">
        {payload}
      </button>
      <Popup open={open}>
        <form
          style={{width: "60rem"}}
          className="text-black p-4 bg-black m-2 border rounded "
          onSubmit={onSubmit}
        >
          <div className="text-white font-semibold p-2">Edit your log</div>
          <div className="flex flex-row text-white items-center">
            <div className="pr-2"> {">>>"}</div>
            <input
              autoFocus
              onChange={(e) => setText(e.target.value)}
              value={defaultText}
              className="p-2 outline-none bg-black pb-2 w-full"
              type="text"
            />
          </div>
        </form>
      </Popup>
    </>
  );
};

const TaggedComponent = ({tags, messages}) => {
  const [open, setOpen] = useState(false);
  // const msgs = get;
  const togglePopUp = () => setOpen(!open);
  return (
    <>
      {tags?.length > 0 ? (
        <button
          onClick={togglePopUp}
          className="ml-3 text-left bg-white text-black p-1 rounded"
        >
          Tag(s)
        </button>
      ) : (
        <button
          onClick={togglePopUp}
          disabled={true}
          className="ml-3 text-left bg-gray-500 text-black p-1 rounded"
        >
          Tag(s)
        </button>
      )}

      <Popup open={open}>
        <div className="text-black p-4 bg-black m-2 border">
          <div className="text-white text-xl font-bold pb-8">Tagged Logs</div>
          <div className="grid grid-flow-col grid-cols-10 text-white border-b-4 font-extrabold">
            <div className="col-span-1 p-2 pl-0"> Date</div>
            <div className="col-span-1 p-2 pl-0"> Time</div>
            <div className="col-span-2 p-2 pl-0"> User</div>
            <div className="col-span-6 p-2 pl-0"> Payload</div>
          </div>
          <div className="text-white">
            {tags &&
              messages
                .filter(({id}) => tags.some((t) => t === id))
                .map(({id, time, display_name, payload, type}) => {
                  const date = new Date(time);
                  const displayDate =
                    date.getFullYear() +
                    "-" +
                    (date.getMonth() + 1) +
                    "-" +
                    date.getDate();
                  const displayTime =
                    date.getHours() +
                    ":" +
                    date.getMinutes() +
                    ":" +
                    date.getSeconds();

                  return (
                    <div
                      key={id}
                      className="grid grid-flow-col grid-cols-10 text-white border-b-4 font-extrabold"
                    >
                      <div className="col-span-1 p-2 pl-0">{displayDate}</div>
                      <div className="col-span-1 p-2 pl-0">{displayTime}</div>
                      <div className="col-span-2 p-2 pl-0">{display_name}</div>
                      {type === "text" ? (
                        <div className="col-span-6 text-left ">{payload}</div>
                      ) : (
                        <img
                          className="round-md col-span-6 rounded-md w-96 mt-3"
                          src={payload}
                          alt={`${payload}`}
                        />
                      )}
                    </div>
                  );
                })}
            {!tags && (
              <div className="w-full py-3">
                This message is not tagging other messages
              </div>
            )}
          </div>
        </div>
      </Popup>
    </>
  );
};
export default LogPage;
