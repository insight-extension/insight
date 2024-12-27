import { HTTPError, ResponseCodeStatus, FetchResponse } from ".";

enum ContentType {
    JSON = "application/json",
}

class HTTPClient {
    constructor(private contentType: ContentType) {
        this.headers = {
            "Content-Type": this.contentType,
        };
    }

    private baseURL = import.meta.env.VITE_API_URL;
    private headers: HeadersInit;

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

export const jsonHTTPClient = new HTTPClient(ContentType.JSON);
