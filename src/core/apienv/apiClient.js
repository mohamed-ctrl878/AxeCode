import { ApiSuccess } from "./apiSucsess";
import { ApiFailure } from "./Apifaliure";

export async function apiClient({
  url,
  method = "GET",
  body = null,
  token = false,
}) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      ...(token && { credentials: "include" }),
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Unknown error");
    }

    return new ApiSuccess(data);
  } catch (err) {
    // console.log(err);
    throw err;
  }
}
