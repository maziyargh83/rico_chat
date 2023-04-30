import { type ActionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let loader = () => redirect("/auth");

export let action = async ({ request }: ActionArgs) => {
  return await authenticator.authenticate("form", request, {
    successRedirect: "/chat",
    failureRedirect: "/",
  });
};
