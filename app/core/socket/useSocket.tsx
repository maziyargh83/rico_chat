import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { config } from "~/Config";
import type { MessageType } from "~/services/http/conversation.service";
import { useClient } from "~/store/useClient";
import { useMessage } from "~/store/useMessages";

export const useSocket = () => {
  const socket = useClient((store) => store.socket);
  const setSocket = useClient((store) => store.setSocket);
  const message = useMessage((store) => store.Message);
  const setMessage = useMessage((store) => store.setMessage);
  const { id } = useParams();
  useEffect(() => {
    // @ts-ignore
    if (socket) return;
    if (!socket) {
      const socketIO = io(config.conversationBaseUrl, {
        reconnection: true,
        reconnectionDelay: 15000,
        reconnectionDelayMax: 5000,
        transports: ["websocket"],
      });
      setSocket(socketIO);
    }
  }, []);

  useEffect(() => {
    if (!socket || socket.hasListeners("messages")) return () => {};
    socket.once("connect", () => {
      console.log("====================================");
      console.log("connect");
      console.log("====================================");
    });
    socket.on("messages", (socketMessage: MessageType) => {
      if (id && socketMessage.conversationId == id) {
        setMessage(socketMessage);
      }
      console.log("====================================");
      console.log(socketMessage);
      console.log("====================================");
    });
    return () => socket.off("messages");
  }, [socket, message]);
};
