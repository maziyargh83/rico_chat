import { Fragment, type PropsWithChildren } from "react";

export const SideBar = ({ children }: PropsWithChildren) => {
  return (
    <Fragment>
      <div className="fixed w-[100px] left-0 h-screen bg-primary border-r border-border">
        {children}
      </div>
      <div className="w-[100px]" />
    </Fragment>
  );
};
