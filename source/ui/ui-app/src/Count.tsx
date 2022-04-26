import React, { useEffect, useState } from "react";
import "./App.css";

interface IApiCount {
  count: number;
}

 const count_url = "/count";
//const count_url = "http://localhost:5000/count"

function Count() {
  const [count, setCount] = useState<IApiCount>({count: 0});

  useEffect(() => {
    (async () => {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const fetchResult = await fetch(count_url);
      const things = await fetchResult.json();

      setCount(things);
    })();
  }, []);

  const handleCount = async () =>   {
    const headers = new Headers();
      headers.append("Content-Type", "application/json");
  
      const fetchResult = await fetch(count_url, {
        method: "POST",
       body: JSON.stringify({ value: 1 }),
        headers: headers,
      });

      const things = await fetchResult.json();

      setCount(things);
  }

  return (
    <div className="App">
      <h1>Count</h1>
      
        <div >
          {count.count}
        </div>
    
        <input type="button" onClick={handleCount} value="Increment"/>
    </div>
  );
}

export default Count;
