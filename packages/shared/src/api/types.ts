import type { Options } from "ky";

export interface RequestParams {
    url: string;
    options: Options;
    traceId: string;
}

export interface FetchParams {
    url: string;
    traceId: string;
}

export interface MutationParams<B> {
    url: string;
    body?: B;
    traceId: string;
}
