import React from "react";
import { Provider } from "mobx-react";
import classnames from "classnames";
import {
    Button,
    Classes,
    FocusStyleManager,
    NonIdealState,
} from "@blueprintjs/core";
import Navbar from "./components/Navbar";
import Dialogs from "./components/Dialogs";

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
      {appState.graph.hasGraph && <FloatingCards />} */}
            <Dialogs />
        </div>
    );
}

export default App;
