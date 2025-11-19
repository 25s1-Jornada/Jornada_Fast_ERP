const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7122";

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(options.headers);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    throw new Error("Não autorizado");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // @ts-ignore
  return (await res.text()) as T;
}

export const api = {
  get: <T = any>(path: string) => request<T>(path, { method: "GET" }),
  post: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: <T = any>(path: string) => request<T>(path, { method: "DELETE" }),
};

export type ApiList<T> = T[];
