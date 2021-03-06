import React from "react";
import classnames from "classnames";
import { Classes } from "@blueprintjs/core";
import Navbar from "./components/Navbar";
import Dialogs from "./components/Dialogs";
import ThreeJSVis from "./components/visualize/Visualizer";
// import NodeDetail from "./components/panels/NodeDetailPanel";
// import State from "./state";
// import EdgesPanel from "./components/panels/EdgesPanel";
// import LabelsPanel from "./components/panels/LabelsPanel";
// import SelectionPanel from "./components/panels/SelectionPanel";
// import GlobalPanel from "./components/panels/GlobalPanel";
// import NodesPanel from "./components/panels/NodesPanel";
import FloatingCards from "./components/FloatingCards";

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
            <FloatingCards />
            <Dialogs />
        </div>
    );
}

export default App;
