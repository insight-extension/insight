import ky, { Options } from "ky";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";

import { type APIError, parseAPIError } from ".";

class APIClient {
    private baseURL: string = import.meta.env.VITE_API_URL;
    private headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    private getURL(url: string) {
        return this.baseURL + url;
    }

    private request<R>(url: string, options: Options): TaskEither<APIError, R> {
        return tryCatch(
            async () => await ky(this.getURL(url), options).json<R>(),
            (error: unknown) => parseAPIError(error)
        );
    }

    get<R>(url: string): TaskEither<APIError, R> {
        const options: Options = {
            method: "GET",
            headers: this.headers,
        };

        return this.request<R>(url, options);
    }

    post<B, R>(url: string, body: B): TaskEither<APIError, R> {
        const options: Options = {
            method: "POST",
            headers: this.headers,
            json: body,
        };

        return this.request<R>(url, options);
    }

    patch<B, R>(url: string, body: B): TaskEither<APIError, R> {
        const options: Options = {
            method: "PATCH",
            headers: this.headers,
            json: body,
        };

        return this.request<R>(url, options);
    }

    put<B, R>(url: string, body: B): TaskEither<APIError, R> {
        const options: Options = {
            method: "PUT",
            headers: this.headers,
            json: body,
        };

        return this.request<R>(url, options);
    }

    delete<R>(url: string): TaskEither<APIError, R> {
        const options: Options = {
            method: "DELETE",
            headers: this.headers,
        };

        return this.request<R>(url, options);
    }
}

export const apiClient = Object.freeze(new APIClient());
