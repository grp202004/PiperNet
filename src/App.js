import React from "react";
import classnames from "classnames";
import {
    Button,
    Classes,
    FocusStyleManager,
    NonIdealState,
} from "@blueprintjs/core";
import Navbar from "./components/Navbar";

function App() {
    return (
        <div
            className={classnames({
                "app-wrapper": true,
                [Classes.DARK]: true,
            })}
        >
            <Navbar />
            {/* <main className="main">
        {appState.graph.hasGraph ? <ThreeJSVis /> : <WorkspaceView />}
      </main>
      {appState.graph.hasGraph && <FloatingCards />}
      <Dialogs /> */}
        </div>
    );
}

export default App;
