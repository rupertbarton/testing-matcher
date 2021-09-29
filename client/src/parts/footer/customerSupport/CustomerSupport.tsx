import * as socketclient from "socket.io-client";
import formStyle from "./customerSupport.module.css";
import Feed from "./Feed";
import ChatInput from "./ChatInput";
import { useEffect } from "react";

const CustomerSupport = () => {
  // let socket;
  // useEffect(() => {
  //   socket = socketclient.connect("http://localhost:4000/");
  // }, []);
  return (
    <div className={formStyle.orderForm}>
      <Feed />
      <ChatInput />
    </div>
  );
};

export default CustomerSupport;
