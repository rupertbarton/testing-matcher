import { useState } from "react";
import formStyle from "./customerSupport.module.css";
import { selectSettings } from "src/app/selectors";
import type * as types from "src/types";
import { useSelector } from "react-redux";

const Feed = () => {
  const settingsState: types.settingsState = useSelector(selectSettings);

  const MessageFeed = (messages: string[]) => {
    return messages.map((message) => {
      let messageClass =
        message[0] === "s" ? formStyle.serverMessage : formStyle.userMessage;
      message = message.slice(1, message.length);
      return (
        <article className={messageClass} key={Math.random()}>
          {message}
        </article>
      );
    });
  };

  return (
    <section className={formStyle.feed}>
      {MessageFeed(settingsState.messages)}
    </section>
  );
};

export default Feed;
