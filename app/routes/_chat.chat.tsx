import { Outlet, useParams } from "@remix-run/react";
import { type KeyboardEvent, useState } from "react";
import { FiSend } from "react-icons/fi";
export default function () {
  const [inputValue, setInputValue] = useState<string>("");
  let { id } = useParams();

  const createMessage = () => {
    console.log("====================================");
    console.log("errr");
    console.log("====================================");
  };
  const detectEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      createMessage();
    }
  };
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex-1 flex">
        <Outlet />
      </div>
      {id && (
        <div className="p-4 flex border-t">
          <input
            type="text"
            className="flex-1 bg-slate-600 rounded-sm outline-none text-white p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Message..."
            onKeyDown={detectEnter}
          />
          <button className="px-4" onClick={createMessage}>
            <FiSend />
          </button>
        </div>
      )}
    </div>
  );
}
