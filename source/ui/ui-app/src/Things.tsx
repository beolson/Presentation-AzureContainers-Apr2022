import React, { useEffect, useState } from "react";
import "./App.css";

interface IApiThing {
  id: number;
  value: string;
}

const thing_url = "/thing";
//const thing_url = "http://localhost:5000/thing";

function Things() {
  const [things, setThings] = useState<Array<IApiThing>>([]);
  const [thingInput, setThingInput] = useState<string>("");

  useEffect(() => {
    (async () => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const fetchResult = await fetch(thing_url);
      const things = await fetchResult.json();

      setThings(things);
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const fetchResult = await fetch(thing_url, {
      method: "POST",
      body: JSON.stringify({ value: thingInput }),
      headers: headers,
    });

    const apiThings = await fetchResult.json();
    setThings((current) => [...current, apiThings]);
  };

  return (
    <div className="App">
      <h1>Things</h1>
      {things.map((s) => (
        <div key={s.id}>
          {s.id} - {s.value}
        </div>
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

export default Things;
