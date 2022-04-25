// import React, { useContext, useEffect, useState } from "react";
// import "./App.css";

import Settings from "./Settings";

function App() {
  return (
    <Settings />
  )
}


// const thing_url =
//   "/api/thing";

// interface IApiThing {
//   id: number;
//   value: string;
// }

// function App() {
//   const [things, setThings] = useState<Array<IApiThing>>([]);
//   const [thingInput, setThingInput] = useState<string>("");


//   useEffect(() => {
//     (async () => {
//         const headers = new Headers();
//         headers.append("Content-Type", "application/json");
//         const fetchResult = await fetch(thing_url, {headers: headers});
//         const apiThings = await fetchResult.json();
//         setThings((_) => apiThings);

//     })();
//   }, [ ]);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();


//       const headers = new Headers();
//       headers.append("Content-Type", "application/json");

//       const fetchResult = await fetch(thing_url, {
//         method: "POST",
//         body: JSON.stringify({ value: thingInput }),
//         headers: headers,
//       });

//       const apiThings = await fetchResult.json();
//       setThings((current) => [...current, apiThings]);
    
//   };

//   return (
//     <div className="App">
//       {things.map((thing) => (
//         <div key={thing.id}>{thing.value}</div>
//       ))}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={thingInput}
//           onChange={(e) => {
//             setThingInput((_) => e.target.value);
//           }}
//         />
//         <input type="submit" value="Save Thing" />
//       </form>
//     </div>
//   );
// }

export default App;
