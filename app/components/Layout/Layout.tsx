import { Outlet } from "@remix-run/react";
import { type PropsWithChildren } from "react";
import { Main } from "~/components/Layout/Main";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex">
      {children}
      <Main>
        <Outlet />
      </Main>
    </div>
  );
};
