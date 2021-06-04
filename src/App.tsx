import classnames from "classnames";
import { Classes } from "@blueprintjs/core";
import Navbar from "./components/Navbar";
import Dialogs from "./components/Dialogs";
import ThreeJSVis from "./components/visualize/Visualizer";
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
