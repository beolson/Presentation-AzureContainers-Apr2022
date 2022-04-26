import React, { useEffect, useState } from "react";
import "./App.css";

//const settings_url = "http://localhost:5203/settings";
const settings_url = "/settings"

function Settings() {
  const [settings, setSetting] = useState<
    Array<{ key: string; value: string }>
  >([]);

  useEffect(() => {
    (async () => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const fetchResult = await fetch(settings_url);
      const apiSettings = await fetchResult.json();

      setSetting(
        Object.entries(apiSettings).map(([key, value]) => {
          return {
            key: key,
            value: value as string,
          };
        })
      );
    })();
  }, []);

  return (
    <div className="App">
      <h1>Client Settings</h1>
      {settings.map((s) => (
        <div key={s.key}>
          {s.key} - {s.value}
        </div>
      ))}
    </div>
  );
}

export default Settings;
