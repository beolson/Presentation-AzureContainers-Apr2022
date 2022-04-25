import React, {  useEffect, useState } from "react";
import "./App.css";


const thing_url =
  "http://localhost:5203/settings";


function Settings() {
  const [settings, setSetting] = useState<{}>([]);


  useEffect(() => {
    (async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const fetchResult = await fetch(thing_url);
        const apiSettings = await fetchResult.json();

        // Object.entries(apiSettings).map(([key, value]) => )

        setSetting(apiSettings);

    })();

  }, [ ]);



  return (
    <div className="App">
      {Object.entries(settings).map(([key, value]) => (
        <div key={key}>{key} - {value}</div>
      ))}
     
    </div>
  );
}

export default Settings;
