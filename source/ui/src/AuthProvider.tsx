import React, { useEffect, useState } from "react";
import * as Msal from "@azure/msal-browser";
import { acquireToken } from "./msalPublicClientApplicationFactory";

const AuthContext = React.createContext<IAuthContext | undefined>(undefined);
export interface IAuthConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  loginScopes: string[];
}

export interface IUser {
  name?: string;
  userName?: string;
  isLoggedIn: boolean;
}

export interface authProviderProps {
  loginScopes: Array<string>;
  msalPublicClientApp: Msal.PublicClientApplication;
  children:
    | JSX.Element
    | ((
        auth: IUser,
        acquireToken: (scopes: Array<string>) => Promise<string>
      ) => JSX.Element);
  loadingView?: JSX.Element;
  dangerousUseTokenFromQueryStringParameter?: string;
  isOffline?: boolean;
}

export interface IAuthContext {
  authState: IUser;
  getAccessToken: (scopes: Array<string>) => Promise<string>;
}

const isLoggedIn = (
  msalPublicClientApp: Msal.PublicClientApplication
): boolean => {
  return msalPublicClientApp.getAllAccounts().length > 0;
};

const getAccount = (
  msalPublicClientApp: Msal.PublicClientApplication
): IUser => {
  if (isLoggedIn(msalPublicClientApp)) {
    const account = msalPublicClientApp.getAllAccounts()[0];
    return { name: account.name, userName: account.username, isLoggedIn: true };
  } else {
    return { name: "", userName: "", isLoggedIn: false };
  }
};

const login = async (
  msalPublicClientApp: Msal.PublicClientApplication,
  loginScopes: Array<string>
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const loginHint = urlParams.get("loginHint");

  try {
    console.log("trying sso silent", {
      scopes: loginScopes,
      loginHint: loginHint ? loginHint : undefined,
    });
    const result = await msalPublicClientApp.ssoSilent({
      scopes: loginScopes,
      loginHint: loginHint ? loginHint : undefined,
    });
    console.log("sso silent worked");
    return result;
  } catch (err) {
    console.log("sso silent did not work, trying redirect");
    try {
      await msalPublicClientApp.loginRedirect({
        scopes: loginScopes,
        loginHint: loginHint ? loginHint : undefined,
      });
      console.log("redirect did not work, trying popup");

      return;
    } catch (e) {
      const result = await msalPublicClientApp.loginPopup({
        scopes: loginScopes,
        loginHint: loginHint ? loginHint : undefined,
      });
      console.log("Last chance.  I hope this worked.  ");

      return result;
    }
  }
};

const RenderChildren = (props: {
  children:
    | JSX.Element
    | ((
        auth: IUser,
        acquireToken: (scopes: Array<string>) => Promise<string>
      ) => JSX.Element);
  user: IUser;
  acquireToken: (scopes: Array<string>) => Promise<string>;
}) => {
  if (props.user.isLoggedIn) {
    if (typeof props.children !== "function") {
      return props.children;
    } else {
      return props.children(props.user, acquireToken);
    }
  } else {
    return null;
  }
};

const GetTokenIfExists = (parameter?: string) => {
  if (!parameter) {
    return null;
  }
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
};

const AuthProvider = (props: authProviderProps) => {
  const { loginScopes, msalPublicClientApp, children } = props;

  const [authState, setAuthState] = useState<IUser>({
    name: "",
    userName: "",
    isLoggedIn: false,
  });

  const isOffline = props.isOffline ? true : false;

  const acquireToken = async (scopes: Array<string>) => {
    const account = msalPublicClientApp.getAllAccounts()[0];
    var tokenResult = await msalPublicClientApp.acquireTokenSilent({
      scopes,
      account: account,
    });
    return tokenResult.accessToken;
  };

  useEffect(() => {
    (async () => {
      var currentAccount = getAccount(msalPublicClientApp);
      console.log(currentAccount);
      if (currentAccount.isLoggedIn) {
        setAuthState(getAccount(msalPublicClientApp));
      } else {
        const result = await msalPublicClientApp.handleRedirectPromise();

        if (!result) {
          const result = await login(msalPublicClientApp, loginScopes);
          if (result) {
            setAuthState(getAccount(msalPublicClientApp));
          }
        } else {
          if (!isLoggedIn(msalPublicClientApp)) {
            const result = await login(msalPublicClientApp, loginScopes);
            if (result) {
              setAuthState(getAccount(msalPublicClientApp));
            }
          } else {
            setAuthState(getAccount(msalPublicClientApp));
          }
        }
      }
    })();
  }, [loginScopes, msalPublicClientApp, isOffline]);

  return (
    <AuthContext.Provider value={{ authState, getAccessToken: acquireToken }}>
      <RenderChildren
        children={children}
        user={authState}
        acquireToken={acquireToken}
      />
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
