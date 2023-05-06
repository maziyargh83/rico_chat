import { type LinksFunction, type LoaderArgs } from "@remix-run/node";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import ReactCodeInput from "react-code-input";
import { ClientOnly } from "remix-utils";
import resetFocus from "~/styles/reset-focus.css";
import { AnimatePresence, motion } from "framer-motion";
import { sendCodeApi, loginUserApi } from "~/services/http/user.service";
import { ClipLoader } from "react-spinners";
import { useSubmit } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: resetFocus },
];
const Regex = new RegExp(
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
);
const variants = {
  default: { scale: 1 },
  submit: { scale: 0.7 },
};
export let loader = async ({ request }: LoaderArgs) => {
  const res = await authenticator.isAuthenticated(request);
  console.log(res);
  return res;
};

export default function Auth() {
  const [email, setEmail] = useState("");
  const [secondStep, setSecondStep] = useState(false);
  const [code, setCode] = useState("");
  const [countDown, setCountDown] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const submit = useSubmit();
  const isEmailValid = useMemo(() => {
    return Regex.test(email);
  }, [email]);
  const goSecondStep = async () => {
    setLoading(true);
    setCountDown(undefined);
    setCode("");

    const data = await sendCodeApi(email);
    console.log(data);

    setSecondStep(true);

    setCountDown(data.getResult().timer);
    setLoading(false);
  };

  const resetStep = () => {
    setSecondStep(false);
    setCountDown(undefined);

    setCode("");
  };
  const loginUser = async () => {
    setLoading(true);
    const data = await loginUserApi(email, code);

    const res = {
      accessToken: data.getResult().accessToken,
      ...data.getResult().user,
    };

    const formData = new FormData();
    for (let key in res) {
      formData.append(key, res[key as keyof typeof res]);
    }

    submit(formData, {
      action: "/auth/login",
      method: "POST",
    });

    setLoading(false);
  };
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (countDown) {
      timer = setInterval(() => {
        if (countDown <= 1) {
          setCountDown(undefined);
          clearInterval(timer);

          return;
        }
        setCountDown(countDown - 1);
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countDown]);
  useEffect(() => {
    if (code.length == 6 && !loading) {
      loginUser();
    }
  }, [code]);
  const remainTime = useMemo(() => {
    if (!countDown)
      return {
        done: true,
        text: "Resend Code",
      };
    const minutes = Math.floor(countDown / 60);
    const seconds = countDown % 60;
    const data = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    return {
      done: false,
      text: `Resend Code - ${data}`,
    };
  }, [countDown]);
  return (
    <AnimatePresence initial={false}>
      <div className="w-screen h-screen flex-col flex justify-center items-center">
        <div className="relative h-48 w-48">
          <img src="/blob.png" className="absolute w-full h-full" alt="" />
        </div>
        <div className="flex flex-col w-[400px] p-10 shadow-lg rounded-2xl  border">
          <p className="text-lg font-bold">Enter your email</p>
          <motion.div
            variants={variants}
            animate={secondStep ? "submit" : "default"}
            initial={"default"}
            className={clsx("flex-1  mt-10 flex rounded-xl  items-center", {
              border: secondStep,
            })}
          >
            <input
              type="text"
              className={clsx("w-full rounded-xl p-2", {
                border: !secondStep,
              })}
              placeholder="Enter Email"
              style={{
                height: "42px",
              }}
              disabled={secondStep}
              onChange={(e) => setEmail(e.target.value)}
            />
            {secondStep && (
              <span
                onClick={resetStep}
                className="text-blue-400 mx-2 border cursor-pointer select-none border-blue-500 rounded p-1 text-xs font-bold"
              >
                Change
              </span>
            )}
          </motion.div>
          {secondStep && (
            <ClientOnly>
              {() => {
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 mt-5"
                  >
                    <ReactCodeInput
                      inputMode="numeric"
                      className="!flex  rounded w-full justify-between"
                      autoFocus={true}
                      inputStyle={{
                        fontFamily: "monospace",
                        MozAppearance: "textfield",
                        borderRadius: "6px",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,.10)",
                        margin: "4px",
                        paddingLeft: "8px",
                        paddingRight: 0,
                        width: "36px",
                        height: "42px",
                        fontSize: "32px",
                        boxSizing: "border-box",
                      }}
                      name="code"
                      type="number"
                      fields={6}
                      onChange={setCode}
                    />
                  </motion.div>
                );
              }}
            </ClientOnly>
          )}
          {!secondStep && (
            <motion.button
              key={"next"}
              disabled={!isEmailValid}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={clsx("w-full p-4 mt-10 rounded-xl text-white", {
                "bg-blue-400": isEmailValid,
                "bg-blue-400/50": !isEmailValid,
              })}
              onClick={goSecondStep}
            >
              {!loading ? (
                "Next"
              ) : (
                <ClipLoader color={"#fff"} loading={loading} size={20} />
              )}
            </motion.button>
          )}
          {secondStep && (
            <motion.button
              key={"submit"}
              disabled={!countDown}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={clsx("w-full p-4 mt-10 rounded-xl ", {
                "bg-green-400 text-white": remainTime.done,
                "bg-gray-300/50 text-gray-600": !remainTime.done,
              })}
              onClick={goSecondStep}
            >
              {remainTime.text}
            </motion.button>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
