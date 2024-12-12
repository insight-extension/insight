import { HTTPError } from ".";

export interface FetchTagsOption {
    tags: string[];
}

export interface RevalidateCacheResponse {
    revalidatedAt: number;
}

export enum ResponseStatus {
    SUCCESS = "success",
    PARSE_ERROR = "parseError",
    ERROR = "error",
}

export type FetchResponse<D> = D | null;

export interface FetchResult<D = null> {
    data: D | null;
    error: HTTPError | null;
    status: ResponseStatus;
}
