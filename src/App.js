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
import ThreeJSVis from "./components/visualize/visualizer";
// import NodeDetail from "./components/panels/NodeDetailPanel";
import State from "./state/index";
// import FloatingCards from "./components/FloatingCards";

function App() {
    return (
        <div
            className={classnames({
                "app-wrapper": true,
                [Classes.DARK]: true,
            })}
        >
            <Navbar />
            <main className="main">
                <ThreeJSVis />
            </main>
            {/* {State.graph.hasGraph && <FloatingCards />} */}
            <Dialogs />
        </div>
    );
}

export default App;
