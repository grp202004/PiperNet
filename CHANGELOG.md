# Changelog

## [1.0.0](https://github.com/grp202004/PiperNet) (2021-04-08)

this version has bug fixes and improvements

**Fixed bugs:**

-   size of node details table [\#72](https://github.com/grp202004/PiperNet/issues/72)
-   nodes in Split Cluster [\#67](https://github.com/grp202004/PiperNet/issues/67)
-   cluster shape no response in graph option [\#66](https://github.com/grp202004/PiperNet/issues/66)
-   BoxSelection [\#63](https://github.com/grp202004/PiperNet/issues/63)
-   Snapshot can not be imported properly when use sample csv file [\#57](https://github.com/grp202004/PiperNet/issues/57)
-   node color not change when mouse hover in csv file [\#56](https://github.com/grp202004/PiperNet/issues/56)
-   attribute id in node dsata sheet when only edge file is imported [\#52](https://github.com/grp202004/PiperNet/issues/52)
-   Node highlight [\#48](https://github.com/grp202004/PiperNet/issues/48)
-   The multiple node details table at buttom is missing [\#47](https://github.com/grp202004/PiperNet/issues/47)
-   Hovering a node, part of the display of its edge changed as expected [\#43](https://github.com/grp202004/PiperNet/issues/43)
-   2D Graph missing [\#13](https://github.com/grp202004/PiperNet/issues/13)

**Closed issues:**

-   \#\#\# UI Modification [\#73](https://github.com/grp202004/PiperNet/issues/73)
-   Add cancel button in add edge datasheet [\#55](https://github.com/grp202004/PiperNet/issues/55)
-   Rewrite Search Panel Component [\#37](https://github.com/grp202004/PiperNet/issues/37)
-   Graph -\> Load Samples is not working, so we temporarily disabled the sample buttons [\#25](https://github.com/grp202004/PiperNet/issues/25)
-   Opening DataSheetDialog might experience delay and UI freezing, especially with a large dataset [\#24](https://github.com/grp202004/PiperNet/issues/24)
-   A cluster with less than 4 nodes might not form a cluster [\#22](https://github.com/grp202004/PiperNet/issues/22)
-   Hide the edges in 3D convex hull and just display with the hull in translucent color [\#10](https://github.com/grp202004/PiperNet/issues/10)

## [0.6-beta](https://github.com/grp202004/PiperNet/tree/0.6-beta) (2021-03-12)

[Full Changelog](https://github.com/grp202004/PiperNet/compare/v0.5.0.1-beta...0.6-beta)

**Features Added**

-   Add four modes for different usage.
-   Users can multi-select nodes only in Node Selection mode. Both Click selection and Box selection can select nodes and node details will be shown in the bottom table.
-   Users can import CSV files in a new dialog in a more clear way step by step.
-   Users can merge clusters in Cluster Selection mode. In this way, users can define new clusters.
-   Users can select nodes and form a new cluster.
-   Users can split cluster in Cluster Splitting mode following the given instructions.
-   The operations on clusters will be recorded in Node Data sheet. The properties in clusters can be exported and stored in GEXF files. The clusters can be the same as that in the previous files.

[Full Changelog](https://github.com/grp202004/PiperNet/compare/v0.5.0.1-beta...0.6-beta)

**Fixed bugs:**

-   Split Cluster get stuck after first operation [\#68](https://github.com/grp202004/PiperNet/issues/68)
-   Cluster attribute error when import the exported snapshot file [\#65](https://github.com/grp202004/PiperNet/issues/65)
-   RightClickPanel-Cluster node [\#60](https://github.com/grp202004/PiperNet/issues/60)

**Merged pull requests:**

-   Cluster cut merge [\#71](https://github.com/grp202004/PiperNet/pull/71) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   U iedit -\> ClusterCutMerge [\#70](https://github.com/grp202004/PiperNet/pull/70) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Combine the two import ways into one dialog [\#69](https://github.com/grp202004/PiperNet/pull/69) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   merge Multi select to ClusterCutMerge to prepare for merging to master [\#64](https://github.com/grp202004/PiperNet/pull/64) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Multiple delete -\> ClusterCutMerge [\#62](https://github.com/grp202004/PiperNet/pull/62) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Importupdate -\> ClusterCutMerge [\#61](https://github.com/grp202004/PiperNet/pull/61) ([Kaby-Lake](https://github.com/Kaby-Lake))

## [v0.5-beta](https://github.com/grp202004/PiperNet/tree/v0.5-beta) (2021-03-04)

**Tone**
Interactions & Operations

**Features Added**

-   DataSheetTable can be generated accordingly which shows the nodes data and edges data of the graph, the attributes related
    to nodes and edges can be displayed as well as edited as a cell form inside the table.
-   The Node Table also includes features like searching for nodes using queries, adding nodes (with Popover to type in details) as
    well as deleting nodes.
-   The Edge Table also includes features like searching for edges using queries, adding edges (in between two nodes) as well as
    deleting edges.
-   The sidebar control panel UI which can toggle the graph options, such as color-pickers of color options and sliders to control the node size.
-   Testing on our most important class (ImportStore) which basically handle the stuff in importing the graph has complete.
-   The Clusters of a graph can be generated either using the Convex Hull Object3D or SphereGeometry, with each cluster in different colours, moving the
    node inside a cluster will refresh the shape of the cluster as well.
-   More sample input files have been founded with brief explanation and citation (citations will be available on the user handbook).
-   user can hover the mouse on a node and the details of which node will appear on the top-right corner as a table, besides, the
    user can change node details directly in this table
-   users can hover the mouse on a node and the edges linked to this node will be highlighted
-   The InteractiveDeleteEdge has been done, in which you can right-click on a node and select Delete Edge to active this panel on
    the right-bottom corner of the screen. This panel acts as a table and lists all the edges that are connected to this node, clicking
    on a row in this table will preview the selected edge with the camera focusing on this node. There’s also a button to delete the
    edges in the table mentioned above
-   Right-click on the background will pop-up a context menu where you can add nodes to this graph

**Fixed bugs:**

-   Delete edge in edge data sheet not working [\#49](https://github.com/grp202004/PiperNet/issues/49)
-   Delete edges [\#46](https://github.com/grp202004/PiperNet/issues/46)
-   addEdge [\#45](https://github.com/grp202004/PiperNet/issues/45)
-   New nodes generated in cluster [\#42](https://github.com/grp202004/PiperNet/issues/42)
-   UI inconsistency: attribute to be clustered issue [\#40](https://github.com/grp202004/PiperNet/issues/40)
-   Addition/Deletion on nodes and edges won’t refresh the 3D graph respectively [\#39](https://github.com/grp202004/PiperNet/issues/39)
-   Add Edges working when only input one node id in edge data sheet [\#33](https://github.com/grp202004/PiperNet/issues/33)
-   invalid edge when adding edges in edge data sheet [\#32](https://github.com/grp202004/PiperNet/issues/32)
-   hidden text in search box in edge data sheet [\#31](https://github.com/grp202004/PiperNet/issues/31)
-   Data sheet mismatch the headers [\#29](https://github.com/grp202004/PiperNet/issues/29)
-   No responding when an error graph which is imported [\#19](https://github.com/grp202004/PiperNet/issues/19)

**Closed issues:**

-   Changing the "Cluster By" value might not produce the desired cluster graph as wanted [\#23](https://github.com/grp202004/PiperNet/issues/23)
-   A cluster which is physically inside another cluster might not display the correct cluster colour [\#21](https://github.com/grp202004/PiperNet/issues/21)
-   The Graph Options sidebar only has UI by real functionalities [\#18](https://github.com/grp202004/PiperNet/issues/18)
-   The edges do not show in 3D Convex Hule, the edges only show up when zooming in [\#11](https://github.com/grp202004/PiperNet/issues/11)
-   Graph Generation edge [\#1](https://github.com/grp202004/PiperNet/issues/1)

**Merged pull requests:**

-   Issuesfix -\> master [\#53](https://github.com/grp202004/PiperNet/pull/53) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Add edge -\> master [\#51](https://github.com/grp202004/PiperNet/pull/51) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Sphere cluster -\> master [\#50](https://github.com/grp202004/PiperNet/pull/50) ([Kaby-Lake](https://github.com/Kaby-Lake))
-   Fix emergency issue: graph not refreshing / incorrect graph generation [\#44](https://github.com/grp202004/PiperNet/pull/44) ([Kaby-Lake](https://github.com/Kaby-Lake))
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
