import { apiHTTPClient } from "@repo/ui/http/client";

import { ILoginRequest, ILoginResponse } from "./types";

class AuthenticationService {
  private baseURL = "/auth";

  private getURL(url: string) {
    return this.baseURL + url;
  }

  public login = async ({ publicToken }: { publicToken: string }) =>
    await apiHTTPClient.post<ILoginRequest, ILoginResponse>(
      this.getURL("/login"),
      {
        publicToken,
      }
    );
}

export const authenticationService = new AuthenticationService();
