import * as Msal from "@azure/msal-browser";

export interface IAuthConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  loginScopes: string[];
}

let publicClientApplications: Msal.PublicClientApplication;

const msalPublicClientApplicationFactory = (
  config: IAuthConfig,
  enableLogging: boolean = false
) => {
  if (!publicClientApplications) {
    var msalConfig: Msal.Configuration = {
      auth: {
        clientId: config.clientId,
        authority: config.authority,
        redirectUri: config.redirectUri,
      },
      cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        // storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
        //cacheLocation: "localStorage"
      },
      system: {
        loggerOptions: {
          loggerCallback: (level, message, containsPii) => {
            if (enableLogging) {
              if (containsPii) {
                return;
              }
              switch (level) {
                case Msal.LogLevel.Error:
                  console.error(`${message}`);
                  return;
                case Msal.LogLevel.Info:
                  console.info(`${message}`);
                  return;
                case Msal.LogLevel.Verbose:
                  console.debug(`${message}`);
                  return;
                case Msal.LogLevel.Warning:
                  console.warn(`${message}`);
                  return;
              }
            }
          },
        },
      },
    };
    publicClientApplications = new Msal.PublicClientApplication(msalConfig);
  }

  return publicClientApplications;
};

const acquireToken = async (scopes: string[]) => {
  const account = publicClientApplications.getAllAccounts()[0];
  var tokenResult = await publicClientApplications.acquireTokenSilent({
    scopes,
    account: account,
  });
  return tokenResult.accessToken;
};

export { msalPublicClientApplicationFactory, acquireToken };
