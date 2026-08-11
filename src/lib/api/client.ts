// NEXT_PUBLIC_API_BASE_URL must be set explicitly, even to an empty string.
// Empty string is a deliberate choice: requests resolve relative and hit this
// app's own route handlers (the temporary mock backend). `undefined` means the
// variable was never set — that's a misconfigured environment, not a default
// to silently paper over with a guessed origin.
if (process.env.NEXT_PUBLIC_API_BASE_URL === undefined) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Set it to the backend origin, or to " +
      "an empty string to use this app's own mock API route handlers.",
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}