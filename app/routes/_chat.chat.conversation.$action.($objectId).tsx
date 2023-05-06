import {
  useLoaderData,
  useNavigate,
  useParams,
  useRevalidator,
} from "@remix-run/react";
import { type InputHTMLAttributes, useState, useEffect } from "react";
import {
  CreateConversation,
  updateConversation,
} from "~/services/http/conversation.service";
import { useConversations } from "~/store/useConversations";
import { status, type createConversation } from "~/types/createConversations";
import { redirect, type LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { type loginUserApiResponse } from "~/services/http/user.service";
export async function loader({ request }: LoaderArgs) {
  const user = (await authenticator.isAuthenticated(
    request
  )) as loginUserApiResponse;
  if (!user) return redirect("/");
  return { token: user.accessToken };
}

export default function Conversation() {
  const { token } = useLoaderData();
  const params = useParams();
  const navigation = useNavigate();
  const revalidator = useRevalidator();

  const conversations = useConversations((store) => store.conversations);
  const activeConversation = conversations.filter(
    (item) => item.objectId == params.objectId
  )[0];
  const [formData, setFormData] = useState<createConversation>({
    title: "",
    description: "",
    status: status.private,
  });

  const changeForm: InputHTMLAttributes<HTMLInputElement>["onChange"] = (e) => {
    let data = parseInt(e.target.value);
    const res = isNaN(data) ? e.target.value : data;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: res,
    }));
  };

  const formAction: "create" | "edit" =
    params?.action == "edit" ? "edit" : "create";
  const submit = async () => {
    if (formAction == "create") {
      await CreateConversation(formData, token);
      revalidator.revalidate();
      navigation("/chat");
    } else {
      await updateConversation(formData, activeConversation.objectId, token);
      revalidator.revalidate();

      navigation("/chat");
    }
  };
  useEffect(() => {
    if (activeConversation && formAction == "edit") {
      const { status, title, description } = activeConversation;
      setFormData({
        status,
        title,
        description,
      });
    }
  }, [activeConversation]);
  return (
    <div className="flex flex-1 flex-col justify-center items-center h-full">
      <div className="bg-primary self-center mx-auto p-10 rounded-2xl">
        <h3 className="text-light text-2xl font-bold text-center uppercase mb-10">
          {formAction} conversation
        </h3>
        <div className="flex flex-col space-y-10 ">
          <div className="flex flex-col">
            <p className="text-light text-base font-bold mb-5">
              Title Conversation
            </p>
            <input
              type="text"
              value={formData.title}
              name="title"
              onChange={changeForm}
              className="bg-transparent border rounded p-2 text-light flex-1"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-light text-base font-bold mb-5">
              Description Conversation
            </p>
            <input
              type="text"
              value={formData.description}
              name="description"
              onChange={changeForm}
              className="bg-transparent border rounded p-2 text-light flex-1"
            />
          </div>
          <div className="flex flex-col space-y-3 text-light">
            <label className="space-x-2">
              <input
                type="radio"
                name="status"
                value={status.private}
                onChange={changeForm}
                checked={formData.status == status.private}
              />
              <span>Private</span>
            </label>
            <label className="space-x-2">
              <input
                type="radio"
                name="status"
                value={status.public}
                onChange={changeForm}
                checked={formData.status == status.public}
              />

              <span>Public</span>
            </label>
          </div>
          <button
            onClick={submit}
            className="border p-5 text-green-400 border-green-300 uppercase hover:bg-green-100/20 rounded"
          >
            {formAction}
          </button>
        </div>
      </div>
    </div>
  );
}
