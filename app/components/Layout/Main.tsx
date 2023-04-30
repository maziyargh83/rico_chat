import { type PropsWithChildren } from "react";

export const Main = ({ children }: PropsWithChildren) => {
  return <div className="flex-1 h-screen bg-slate-500">{children}</div>;
};
