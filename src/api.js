import {
  collection,
  getFirestore,
  getDocs,
  getDoc,
  addDoc,
  onSnapshot,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
const db = getFirestore();
const LOGS = "logs";
const MESSAGE = "message";

const getAllLogs = async () => {
  const c = collection(db, LOGS);
  const docs = await getDocs(c);
  return docs.docs.map((d) => ({id: d.id, ...d.data()}));
};

const sendsMessage = async ({
  username,
  userId,
  payload,
  logId,
  type,
  reference,
}) => {
  const c = collection(db, MESSAGE);
  const currentDate = Date.now();
  await addDoc(c, {
    display_name: username,
    time: currentDate,
    user_id: userId,
    log_id: logId,
    approved: false,
    tags: reference,
    payload,
    type,
  });
};

const getMessages = async (logId, onData) => {
  const c = collection(db, MESSAGE);
  const q = query(c, where("log_id", "==", logId));
  onSnapshot(q, (snapshot) => {
    onData(
      snapshot.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      }))
    );
  });
};

const updateMessage = async (docId, payload) => {
  updateDoc(doc(db, MESSAGE, docId), {payload});
};

const approveMessage = async (docId) => {
  updateDoc(doc(db, MESSAGE, docId), {approved: true});
};

export {updateMessage, getMessages, sendsMessage, getAllLogs, approveMessage};
