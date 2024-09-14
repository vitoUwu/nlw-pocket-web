class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly init?: RequestInit
  ) {}

  private withBaseUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private request(path: string, options?: RequestInit): Promise<Response> {
    return fetch(this.withBaseUrl(path), {
      ...this.init,
      ...options,
    });
  }

  public async get<T = unknown>(
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await this.request(path, options);
    return response.json();
  }

  public async post<T = unknown>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const hasBody = !!body;
    const response = await this.request(path, {
      method: "POST",
      ...(hasBody && { body: JSON.stringify(body) }),
      headers: {
        "Content-Type": hasBody ? "application/json" : "text/plain",
        ...options?.headers,
      },
      ...options,
    });

    return response.json();
  }

  public async delete<T = unknown>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const hasBody = !!body;
    const response = await this.request(path, {
      method: "DELETE",
      ...(hasBody && { body: JSON.stringify(body) }),
      headers: {
        "Content-Type": hasBody ? "application/json" : "text/plain",
        ...options?.headers,
      },
      ...options,
    });
    return response.json();
  }
}
console.log(import.meta.env);
export default new HttpClient(import.meta.env.VITE_ORIGIN, {
  credentials: "include",
});
