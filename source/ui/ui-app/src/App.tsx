import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { InteractionStatus } from "@azure/msal-browser";
import { AuthContext } from "./AuthProvider";

const thing_url =
  "https://adaptpaas-subscriptions-server.azurewebsites.net/api/thing";

interface IApiThing {
  id: number;
  value: string;
}

function App() {
  const [things, setThings] = useState<Array<IApiThing>>([]);
  const [thingInput, setThingInput] = useState<string>("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (authContext) {
        const token = await authContext.getAccessToken([
          "api://77e006f2-732b-4079-a92f-177bec212f01/Impersonate.User",
        ]);
        const headers = new Headers();
        const bearer = `Bearer ${token}`;
         headers.append("Authorization", bearer);
        const fetchResult = await fetch(thing_url, { headers: headers });
        const apiThings = await fetchResult.json();
        setThings((_) => apiThings);
      }
    })();
  }, [authContext, thing_url]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (authContext) {
      const token = await authContext.getAccessToken([
        "api://77e006f2-732b-4079-a92f-177bec212f01/Impersonate.User",
      ]);

      const headers = new Headers();
      const bearer = `Bearer ${token}`;
      headers.append("Authorization", bearer);
      headers.append("Content-Type", "application/json");

      const fetchResult = await fetch(thing_url, {
        method: "POST",
        body: JSON.stringify({ value: thingInput }),
        headers: headers,
      });

      const apiThings = await fetchResult.json();
      setThings((current) => [...current, apiThings]);
    }
  };

  return (
    <div className="App">
      {things.map((thing) => (
        <div key={thing.id}>{thing.value}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={thingInput}
          onChange={(e) => {
            setThingInput((_) => e.target.value);
          }}
        />
        <input type="submit" value="Save Thing" />
      </form>
    </div>
  );
}

export default App;
