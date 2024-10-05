import { BASE_API_URL } from "@repo/shared/configs";

class HTTPClient {
  private baseURL = BASE_API_URL;
  private headers = {
    "Content-Type": "application/json",
  };

  private getURL(url: string) {
    return this.baseURL + url;
  }

  private async request<Response>(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    const response = await fetch(this.getURL(url), options);

    return response.json();
  }

  async get<Response>(url: string): Promise<Response> {
    const options: RequestInit = {
      method: "GET",
      headers: this.headers,
    };

    return this.request<Response>(url, options);
  }

  async post<Body, Response>(url: string, body: Body): Promise<Response> {
    const options: RequestInit = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.request<Response>(url, options);
  }

  async patch<Body, Response>(url: string, body: Body): Promise<Response> {
    const options: RequestInit = {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.request<Response>(url, options);
  }

  async put<Body, Response>(url: string, body: Body): Promise<Response> {
    const options: RequestInit = {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.request<Response>(url, options);
  }

  async delete<Response>(url: string): Promise<Response> {
    const options: RequestInit = {
      method: "DELETE",
      headers: this.headers,
    };

    return this.request<Response>(url, options);
  }
}

export const apiHTTPClient = new HTTPClient();
