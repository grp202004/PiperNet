# Changelog

## [Unreleased](https://github.com/grp202004/PiperNet/tree/HEAD)

[Full Changelog](https://github.com/grp202004/PiperNet/compare/v0.4-beta...HEAD)

**Fixed bugs:**

-   Add Edges working when only input one node id in edge data sheet [\#33](https://github.com/grp202004/PiperNet/issues/33)
-   invalid edge when adding edges in edge data sheet [\#32](https://github.com/grp202004/PiperNet/issues/32)
-   Data sheet mismatch the headers [\#29](https://github.com/grp202004/PiperNet/issues/29)

**Closed issues:**

-   Graph Generation edge [\#1](https://github.com/grp202004/PiperNet/issues/1)

**Merged pull requests:**

-   DeleteEdgeInteractionPanel and AddNodeDialog merge into master [\#36](https://github.com/grp202004/PiperNet/pull/36) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   merge AddNode interaction to the dev branch [\#34](https://github.com/grp202004/PiperNet/pull/34) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   merge Node and Edge Table to master [\#30](https://github.com/grp202004/PiperNet/pull/30) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Make the NodeDetailPanel editable [\#28](https://github.com/grp202004/PiperNet/pull/28) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Electron ability addes to master [\#27](https://github.com/grp202004/PiperNet/pull/27) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   JSdoc and refactor, as well as the search and right-click panel [\#26](https://github.com/grp202004/PiperNet/pull/26) ([Kaby-Lake](https://github.com/Kaby-Lake))

## [v0.4-beta](https://github.com/grp202004/PiperNet/tree/v0.4-beta) (2021-01-30)

[Full Changelog](https://github.com/grp202004/PiperNet/compare/c2c8a46c7a83f9775b9dae15d418d28daaf36efd...v0.4-beta)

**Tone**
First Stage Polish

**Features Added**

-   user can hover the mouse on a node and the details of which node will appear on the top-right corner.
-   user can hold CTRL or SHIFT key and click a node to select or unselect which node, and the details of all nodes selected will appear.
-   user can choose which attribute to be clustered from all the clusters of the nodes, and the clustered 3D graph will be generated.
-   user can modify every single value of a node in the datasheet table by clicking on a cell and modify.
-   user can export the graph either to CSV or GEXF.

**Closed issues:**

-   importstore test [\#12](https://github.com/grp202004/PiperNet/issues/12)

**Merged pull requests:**

-   merge Cluster Engine Polish and get ready for First Stage Release [\#17](https://github.com/grp202004/PiperNet/pull/17) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   merge NodeDetailPanel to Development branch [\#16](https://github.com/grp202004/PiperNet/pull/16) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   merge sample import testing to master [\#15](https://github.com/grp202004/PiperNet/pull/15) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Cluster generation - the convexHullObject3D can be generated [\#7](https://github.com/grp202004/PiperNet/pull/7) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   UI of options pane [\#5](https://github.com/grp202004/PiperNet/pull/5) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Graph generation [\#4](https://github.com/grp202004/PiperNet/pull/4) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   UI [\#3](https://github.com/grp202004/PiperNet/pull/3) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Graph generation done with edge only [\#2](https://github.com/grp202004/PiperNet/pull/2) ([Kaby-Lake](https://github.com/Kaby-Lake))

## v0.3-beta (2021-01-26)

**Tone**
Cluster Generation

**Features Added**

-   Auto CI is achieved: every time a test file is updated on a branch, GitHub will automatically run the test and provide the test outcome.
-   Auto CD is achieved: every time update on master branch will automatically trigger a full build, and will be deployed to GitHub Pages if successful.
-   The Clusters of a graph has been generated using the Convex Hull Object3D, with each cluster in different colours.
-   The additional executable desktop class application can be build and distributed, which can across 3 platforms.
-   More sample input files have been founded with brief explanation and citation.
-   Some basic unit testing has been written, which mainly focuses on the underlining logic behind importing CSV/GEXF to Graphs, but we are currently facing the async/await problems to be solved.
-   A continuous refactor of the backend data structure has been carried out to adherent to several design patterns and improve maintainability.

## v0.2-beta (2021-01-18)

**Tone**
Graph Generation

**Features Added**

-   switching the data structure of storing graph to `graphology`
-   add basic TypeScript support to the project programming languages
-   The node file and edge file can be imported, and the attributes related to Nodes can be displayed as a Table
-   The GEXF file which describing a graph can be imported
-   a non-clustered 3d graph can be generate accordingly with the imported graph data
-   a non-clustered 2d DAG graph can be generate accordingly with the imported graph data
-   DataSheetTable can be generated accordingly which shows the nodes data of the graph
-   The side bar control panel UI which can toggle the graph options have been complete, but functionalities have not been accomplished yet.
-   Backend refactor: a continuous refactor of the backend data structure of our software has carried out.
-   Testing has some progress and we’re currently solving the problems of the combination of JS and TS test frameworks

**Additional**

-   a technical research regarding the operations on manipulating the graph and interactions with the UI has been conducted.

## v0.1-beta (2021-12-20)

**Tone**
Environment setup

**Features Added**

-   the foundation software architectures (using MobX with state management) which contains multiple `Store` classes has been initialized
-   `ngraph.graph` has been selected to be the underling data structures to store the raw graph
-   the basic navbar UI element has been partially done, but with no real interactions