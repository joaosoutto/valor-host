import React, { Suspense } from "react";
import "./App.css";

const RemoteApp = React.lazy(() => import("remoteApp/App"));

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "304px",
      }}
    >
      <div>
        <div>
          <a
            href="https://valor-software.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://valor-software.com/assets/QJVYZQIc-valor-software.webp"
              alt="random"
              style={{ width: "150px", height: "80px" }}
            />
          </a>
        </div>
        <h1>Host MF App</h1>
        <div>
          <a
            className="link"
            href="https://github.com/joaosoutto/valor-host"
            target="_blank"
          >
            <img
              src="https://img.icons8.com/ios11/512/FFFFFF/github.png"
              alt="github"
              style={{ width: "40px", height: "40px" }}
            />
            Check Host App Github Repo
          </a>
        </div>
      </div>
      <div>
        <Suspense fallback={<div>Loading remote component...</div>}>
          <RemoteApp />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
