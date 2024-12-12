import { BASE_API_URL } from "../configs";
import { HTTPError, ResponseCodeStatus, FetchResponse } from ".";

class HTTPClient {
    private baseURL = BASE_API_URL;
    private headers = {
        "Content-Type": "application/json",
    };

    private getURL(url: string) {
        return this.baseURL + url;
    }

    private request<R>(
        url: string,
        options: RequestInit
    ): Promise<FetchResponse<R>> {
        return fetch(this.getURL(url), options)
            .then((response) => {
                if (response.ok) {
                    return response.json() as R;
                }

                throw new HTTPError({
                    message: response.statusText,
                    status: response.status,
                });
            })
            .catch((error) => {
                throw new HTTPError({
                    message: error.message || "",
                    status: error.status || ResponseCodeStatus.UNEXPECTED_ERROR,
                });
            });
    }

    async get<R>(url: string): Promise<FetchResponse<R>> {
        const options: RequestInit = {
            method: "GET",
            headers: this.headers,
        };

        return this.request<R>(url, options);
    }

    async post<B, R>(url: string, body: B): Promise<FetchResponse<R>> {
        const options: RequestInit = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
        };

        return this.request<R>(url, options);
    }

    async patch<B, R>(url: string, body: B): Promise<FetchResponse<R>> {
        const options: RequestInit = {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(body),
        };

        return this.request<R>(url, options);
    }

    async put<B, R>(url: string, body: B): Promise<FetchResponse<R>> {
        const options: RequestInit = {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(body),
        };

        return this.request<R>(url, options);
    }

    async delete<R>(url: string): Promise<FetchResponse<R>> {
        const options: RequestInit = {
            method: "DELETE",
            headers: this.headers,
        };

        return this.request<R>(url, options);
    }
}

export const jsonHTTPClient = new HTTPClient();
