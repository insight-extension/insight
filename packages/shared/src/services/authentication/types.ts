export interface ILoginRequest {
  publicToken: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}
