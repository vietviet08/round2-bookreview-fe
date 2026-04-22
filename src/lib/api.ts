const BASE = import.meta.env.VITE_API_URL || '/api'

export interface Author {
    id?: number;
    name: string;
}

export interface Book {
    id?: number;
    title: string;
    quantity?: number;
    authorId?: number;
    authorName?: string;
}

export interface Review {
    id?: number;
    content: string;
    bookId?: number;
    bookTitle?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

async function request(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  try {
    return await res.json();
  } catch {
    return { status: res.status };
  }
}

export const api = {
  authors: {
    list: (page = 0, size = 5) =>
      fetch(`${BASE}/authors?page=${page}&size=${size}`).then((r) => r.json()),
    all: () => fetch(`${BASE}/authors/all`).then((r) => r.json()),
    create: (data: any) =>
      request(`${BASE}/authors`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      request(`${BASE}/authors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetch(`${BASE}/authors/${id}`, { method: "DELETE" }),
  },
  books: {
    list: (page = 0, size = 5) =>
      fetch(`${BASE}/books?page=${page}&size=${size}`).then((r) => r.json()),
    all: () => fetch(`${BASE}/books/all`).then((r) => r.json()),
    create: (data: any) =>
      request(`${BASE}/books`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      request(`${BASE}/books/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) => fetch(`${BASE}/books/${id}`, { method: "DELETE" }),
  },
  reviews: {
    list: (page = 0, size = 5) =>
      fetch(`${BASE}/reviews?page=${page}&size=${size}`).then((r) => r.json()),
    create: (data: any) =>
      request(`${BASE}/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: any) =>
      request(`${BASE}/reviews/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetch(`${BASE}/reviews/${id}`, { method: "DELETE" }),
  },
};

