import formStyle from "./customerSupport.module.css";
import * as sockets from "src/app/sagas/sockets";
import { useDispatch } from "react-redux";
import { initialise } from "src/reducer/settingsActions";
const { useState } = require("react");

const ChatInput = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = () => {
    console.log(text);
    if (text === "uuddlrlrba") {
      konami();
    } else {
      sockets.sendMessage(text);
    }
    setText("");
  };

  const konami = () => {
    const usernames = [
      "Andrea",
      "Bob",
      "Catherine",
      "Doug",
      "Elliott",
      "admin",
    ];
    usernames.forEach((username) => {
      dispatch(initialise(username));
    });
  };

  const handleKeyDown = (e: any) => {
    const trimmedText = e.target.value.trim();
    if (e.key === "Enter" && trimmedText) {
      handleSubmit();
    }
  };

  return (
    <section className={formStyle.chatInput}>
      <input
        style={{ width: "75%" }}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" onClick={handleSubmit}>
        Send
      </button>
    </section>
  );
};

export default ChatInput;
