import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/table/lib/css/table.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "normalize.css";
import "./App.css";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
