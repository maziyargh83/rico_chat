import { Fragment, type PropsWithChildren } from "react";

export const SideBar = ({ children }: PropsWithChildren) => {
  return (
    <Fragment>
      <div className="fixed w-[100px] left-0 h-screen bg-slate-600">
        {children}
      </div>
      <div className="w-[100px]" />
    </Fragment>
  );
};
