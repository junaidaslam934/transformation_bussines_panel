
import { IAPIParams } from "@/lib/api/types";
import { fetchAuthSession } from "@aws-amplify/auth";
import { errorToast } from "@/lib/toasts";
import { logout } from "@/utils/auth";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; // Define your BASE_URL here

export const API = async (params: IAPIParams) => {
  const {
    method,
    endpoint = "", 
    payload = null,
    isToken = true,
    isFormData = false,
    headers = {},
    // mode = "",
    emptyDeleteBody
  } = params;
  const URL = `${BASE_URL}/${endpoint}`;
  let accessToken;
  const payloadData =
    method !== "GET"
      ? JSON.stringify(payload)
      : undefined;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": method === 'GET' || emptyDeleteBody ? '*/*' : isFormData ? "multipart/form-data" : "application/json",
      ...headers,
    },
    body: payloadData,
    cache: 'no-store'
  };

  if (isToken) {
    const session = await fetchAuthSession();
    accessToken = session.tokens?.accessToken.toString();
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  }

  try {
    const response: Response = await fetch(URL, options);

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error("Internal Server Error");
      }
      const errorMessage = await response.json();
      if (response.status === 401) {
        errorToast(errorMessage.message, "Error");
        await logout()
        window.location.reload()
        throw new Error(errorMessage.message);
      }
      throw new Error(errorMessage.message);
    }

    const responseData = await response.json();
    return [responseData];
  } catch (error) {
    if (error instanceof Error) {
      console.debug(`:x: API ERR [${endpoint}] =====> `, error.message);
      throw new Error(error.message);
    } else {
      console.debug(`:x: API ERR [${endpoint}] =====> `, error);
      throw new Error(String(error));
    }
  }
};
