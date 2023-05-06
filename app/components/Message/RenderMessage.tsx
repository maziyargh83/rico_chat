import { useLayoutEffect, useRef } from "react";
import { v4 } from "uuid";
import { Empty } from "~/components/Empty";
import { Message } from "~/components/Message/Message";
import { useMessage } from "~/store/useMessages";

export const RenderMessages = () => {
  const MessageState = useMessage((store) => store.Message);

  const item = [...MessageState].map(([id, item]) => (
    <Message key={v4()} message={item} />
  ));

  if (MessageState.size == 0) return <Empty />;
  return (
    <div className="flex-1 flex min-h-full">
      <div className="flex flex-1 flex-col justify-end px-5 pt-10">{item}</div>
    </div>
  );
};
