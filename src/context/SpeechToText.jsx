import React, {useEffect, useState} from "react";
import {getTokenOrRefresh} from "../token_util";
import {ResultReason} from "microsoft-cognitiveservices-speech-sdk";

const SpeechToText = (props) => {
  const [displayText, setDisplayText] = useState("");
  useEffect(async () => {
    // check for valid speech key/region
    const tokenRes = await getTokenOrRefresh();
    if (tokenRes.authToken === null) {
      // this.setState({
      //   displayText: "FATAL_ERROR: " + tokenRes.error,
      // });
      setDisplayText("FATAL_ERROR:");
    }
  });

  const sttFromMic = async () => {
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    // this.setState({
    //   displayText: "speak into your microphone...",
    // });
    setDisplayText("speak into your microphone...");

    recognizer.recognizeOnceAsync((result) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      // this.setState({
      //   displayText: displayText,
      // });
      setDisplayText(displayText);
    });
  };

  const fileChange = async (event) => {
    const audioFile = event.target.files[0];
    console.log(audioFile);
    const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;

    // this.setState({
    //   displayText: fileInfo,
    // });
    setDisplayText(fileInfo);

    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizer.recognizeOnceAsync((result) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      this.setState({
        displayText: fileInfo + displayText,
      });
    });
  };

  return (
    <div>
      <input
        className="p-2"
        type="file"
        onChange={(e) => uploadFile({file: e.target.files[0]})}
      />
    </div>
  );
};

export default SpeechToText;
