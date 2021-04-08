# Help Developing PiperNet

Thanks for taking the time to contribute! 🎉 🎊 👍. PiperNet is purely written in front-end without the support of any backend server. However, our overall long time plan is to have a server which hosts sample graph retrieving for convenient demonstration purpose, if you are interested, feel free to contribute to that.

The technology stack of PiperNet are as follows:

-   [Create React App](https://github.com/facebook/create-react-app) for building component-based declarative web-page
-   [MobX](https://mobx.js.org) for global state management
-   [Blueprint](https://blueprintjs.com/) React-based UI toolkit
-   [Graphology](https://graphology.github.io/) for graph data structure storage
-   [three.js](https://threejs.org/) a cross-browser WebGL 3D library
-   [3d-force-graph](https://github.com/vasturiano/3d-force-graph) representing graph using force-directed layout

Knowledge of `React`, `MobX`, `Blueprint` and `Three.js` shall be necessary to understand the codebase.

### Getting started

Looking for places to contribute to the codebase? Check out the [Issues](https://github.com/grp202004/PiperNet/issues) page or purpose any suggestions to the features.

#### Installation

First, ensure you have Node v14+ and the latest npm installed on your machine.

As an external contributor, you will have to fork PiperNet in order to contribute code.
Clone your fork onto your machine and then run the following commands to install dependencies:

```sh
git clone git@github.com:<username>/PiperNet.git
cd PiperNet
npm install
npm start
npm run test
```

#### Deployment

A typical contributor workflow looks like this:

1. Create a new feature branch. We use a format like `[your-initials]/[short-name]`:
   `bd/rename-buttons`.
2. Write some code. :hammer: **Refer to the code format:**

    - use `Prettier` to prettify your code according to our format preference with a `tabWidth` of `4`
    - Use more `React.Component` instead of `React.Hook` to enhance readability and maintainability.
    - Use `arrow function` instead of declaring pure functions to resolve the `this` pointer problem in TypeScript.
    - Contribute TypeScript code rather than JavaScript code to reduce possible errors.
    - you should provide `interface` or any component that you build if this can be re-used in other components, and proper use of `Partial<T>` is necessary.
    - do not use `decorator` in that we did not configure this ES6 feature in our project.
    - you should add necessary unit testing if you are to develop the basement of this project, a Test Driven Approach is preferred.
    - you should properly comment your source code according to the TypeDoc specification
    - Commit messages should be descriptive and useful to anyone at any point in time

3. Ensure your code **compiles properly** and is **tested**, **linted**, and **formatted**.
    - Run `npm build` at the repo root to build all libraries.
    - run unit tests with `npm test` in the relevant package directory.
4. Submit a Pull Request on GitHub and fill out the template.
    - ⚠️ **DO NOT enable CircleCI for your fork.** When you open a PR, your branch will be checked by `GitHub Actions` automatically. There is no need to enable the CI build for your fork's pipeline. If you do, this may cause problems in the CI build.
5. Team members will review your code and merge it after approvals.
    - You may be asked to make modifications to code style or to fix bugs you may have not noticed.
    - Please respond to comments in a timely fashion (even if to tell us you need more time).
    - _Do not_ amend commits and `push --force` as they break the PR history. Please add more commits; we squash each PR to a single commit on merge.

We have `GitHub Actions` configured so that any commit to `master` branch will triggers a web-page deployment to our static GitHub Pages.

For Electron deployment, simply run

```sh
npm run pack-win
npm run pack-mac
```

to build applications for both Windows and macOS platform (you may need macOS environment to build for macOS Application).

### React Two-way data binding using MobX

It is usually anguished to implement a complex project using only the state management provided by React, especially when a lot of components are referring to the same data field, and a subset of these will to change the state and then need to refresh all of them. One techniques is to provide callback functions from the parent component, but this tends to be complex for a multi-level nesting. We use the `observable` and `observer` technology provided by `MobX` to polyfill the data fields, and automatically refresh the components that displays these values. A general approach is as follows:

-   pack the `React.Component` with `observer()`

```typescript
export default observer(
    class UIComponent extends React.Component {
        render();
    }
);
```

-   use `makeAutoObservable` in the constructor to make the fields observable

```typescript
export default class DataClass {
    constructor() {
        makeAutoObservable(this);
    }
    observableField: string; // this field will be watched by MobX
}
```

after that, any modifications on the data fields will automatically re-render the React DOM.

### React Component Ref

You may in some situations want to use the `React.Ref` of one component in other components, this can be achieved by:

-   import the singleton `ComponentRef.tsx` in the component class that you want to keep reference to.
-   create a reference fields inside the component and pass it to the `ComponentRef` in the `ComponentDidMount` stage.

```typescript
import ComponentRef from "ComponentRef";

export default observer(
    class UIComponent extends React.Component {
        ref: React.MutableRefObject<T> = React.createRef();

        render();

        componentDidMount() {
            ComponentRef.thisUIComponentRef = this;
        }
    }
);
```

### Code Hierarchy

> Stores can be found in any Flux architecture and can be compared a bit with controllers in the MVC pattern. The main responsibility of stores is to move logic and state out of your components into a standalone testable unit that can be used in both frontend and backend JavaScript.
>
> **MobX-Defining data stores**

By applying the design philosophy reference above, it is worth demonstrating the structure of our codebase, and should be helpful with the future development/maintenance of this project.

#### Class Diagram

![Class Diagram](https://tva1.sinaimg.cn/large/008eGmZEly1gpchyil336j33cq0u07wh.jpg)

The code hierarchy of all `stores` are as follows

```
├── index.ts

├── GraphStore.ts
├── GraphMutation.ts
├── GraphDelegate.ts

├── ImportStore.ts

├── ClusterStore.ts
├── Cluster3dObjectStore.ts
├── ClusterInteractionStore.ts

├── NodeInteractionStore.ts

├── CssStore.ts
├── PreferencesStore.ts
├── SearchStore.ts
├── HelperStackPanelStore.ts

└── utils
    └── MouseEventUtils.ts
```

a brief introduction of the purpose of each store will be presented, you can also refer to the TypeDoc inside the source code on top of each class as well as functions / fields or visit [PiperNet Online Code Documentation](https://grp202004.github.io/pipernet.api/)

### `index.ts`

provides a global singleton `State` object, containing all other `stores` which is beneficial for other classes or UI to refer to.

### `GraphStore.ts`

define a class for storing the raw graph (`graphology` object), the related metadata information, the public api for setting, refreshing and decorating(change the barebone graph into the appropriate instances that we use to send to 3d-graph renderer) the graph as well as the entry of `GraphMutation` for manipulating the graph.

### `GraphMutation.ts`

provides wrapper functions for manipulating(`add/dropNode`, `add/dropEdge`) the graph, and should be used instead of the apis exposed by `graphology`

### `GraphDelegate.ts`

acts as a bridge between the `graphology` graph data structure and the `3d-force-graph` we use to render the 3D scene. The `visualizationGraph()` will compute the clustered graph to be send to 3d-renderer. The cluster data generated by `ClusterStore` will be used in this process.

we define some customized interfaces `ICustomNodeObject` and `ICustomLinkObject` which extends from the `Node/LinkObject` of `3d-force-graph` with adding fields like `hovered`, `selected` and `multiSelected` to deal with the WebGL mouse interaction. This class also includes reference to the `React.Ref` of 3d-renderer with providing functions like auto-focus the camera as well as update the force inside the cluster.

### `ImportStore.ts`

this class defines some necessary configs for the graph-importing procedures, such as the `INodeFileConfig` and `IEdgeFileConfig` for customizing the csv/gexf file parsing procedure. Other functions like `renderImportNode/EdgePreview` renders the preview table in the ImportDialog, and `importGraphFromCSV/GEXF` reads the file input and produce the `graphology` object to be assigned to `GraphStore` with some basic error handling strategies. These functions are designed to be synchronized to prevent frozen of UI.

### `ClusterStore.ts`

this **store** handles the cluster generating according to the `clusterBy` defined by user, by applying the `computed value` in MobX, the `keyAttributes`, `getAttributeValues`, `attributeKeys`, `attributeColor` and `attributePoints` will auto-compute accordingly in code reference order, and ultimately produce a mapping from (the cluster value) to (a array of node points), which shall be used by `Cluster3DObjectStore` to compute the 3D-convexhull used in the 3d-renderer. You are welcome to refer to the JSDoc in details on what these computed values are about.

### `Cluster3dObjectStore.ts`

the code in this file basically initialize the corresponding Object3D for each cluster, control the addition/deletion/disposition/accessing/updatePosition/updateMaterial of clusters inside the scene, according to the updated map from `ClusterStore` that we demonstrated above.

### `ClusterInteractionStore.ts`

the cluster-mouse-interaction related filed and functions are hereby written in this class, such as `currentlyHoveredClusterId`, `selectedCluster` and `selectedClusters`, these selection should be `flush()` after using(or before entering another interaction mode), the callback functions of mouse events are presented as well to handle events like hover/left/rightClick. There are also helper methods to deal with features like mergeCluster and SplitCluster.

in the cluster splitting procedure, after user draw a curved link, the segment of that line will be stored in the `lineSegment` and `computeSplitCluster` will be called to compute the two stack of split nodes, the result will be stored inside `confirmClusterSplittingTempData` waiting for the final `splitCluster()` function to confirm this operation

### `NodeInteractionStore.ts`

just like the `ClusterInteractionStore`, this one stores the node-mouse-interaction related filed and functions, such as `currentlyHoveredNodeId`, `selectedNode/s`, `selectedEdge/s` and `boxSelection_start/endPoint`, these selection should be `flush()` after using as well, other helper methods to compute the related node/edge neighbors are also inside.

The `updateEdge/NodeVisualizeAttribute` methods shall update the visualization settings of a given node, and the 3d-renderer will refresh based on the changes. this API is somewhat similar to the setState() in React, where you only need to provide the updater (key-value pair to be altered).

### `CssStore.ts`

as the name indicates, it stores the customized style of Nodes/Edges/Label/Clusters, and any change on it should then call `State.graphDelegate.graphDelegateMethods.refresh()` to apply changes

### `PreferencesStore.ts`

it controls the open/close of dialogs/panels, and the VisualizationMode(Normal/NodeSelection/ClusterSelection/ClusterSplitting) as well

### `SearchStore.ts`

this file is the backend support for the NodeSearch feature, and will compute the possible searching candidates according to the query parameters

### `HelperStackPanelStore.ts`

you may notice that when selecting different VisualizationMode, a popover which contains either simple configs or helper messages will pop up, this class stores the necessary information to make that happen
