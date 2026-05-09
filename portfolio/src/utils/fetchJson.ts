export async function fetchJson(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const text = await response.text();

  if (!response.ok) {
    console.error("API request failed:", response.status, response.statusText, "Raw body:", text);
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (!text) {
    throw new Error("Empty response from server");
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.error("Invalid JSON response:", text, parseError);
    throw new Error("Unable to parse JSON response", { cause: parseError });
  }
}
