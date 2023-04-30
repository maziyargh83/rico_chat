// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator(sessionStorage);
// Tell the Authenticator to use the form strategy
const formStrategy = new FormStrategy(async ({ form }) => {
  let data = Object.fromEntries(form.entries());
  console.log(data);

  return data;
});
authenticator.use(formStrategy);
