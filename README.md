# PiperNet

![Deploy master to GitHub Pages](https://github.com/grp202004/PiperNet/workflows/Deploy%20master%20to%20GitHub%20Pages/badge.svg?branch=master) ![Coveralls](https://github.com/grp202004/PiperNet/workflows/Coveralls/badge.svg)

An interactive 3D cluster graph visualization system that runs in your browsers as well as on desktop.

[**Stable Version** - Launch stable beta version of PiperNet in your browser](https://grp202004.github.io/pipernet.online/)

[**Information and Downloads** - Information of this project, Download Software and Sample Datasets](https://grp202004.github.io/pipernet.info)

[**API Documents** - API documents of the codebase](https://grp202004.github.io/pipernet.api)

[**Changelog** - changelog for major version distributions](./CHANGELOG.md)

[**Contribution Guideline** - we are more than welcome to your contribution](./CONTRIBUTING.md)

## About

This project aims to help researchers map the existing information onto the 3D graphs, and discover the undetected details behind the real-world datasets, as well as modify them in various ways.

## Feature Highlights

### Interactive Graph Visualization

![Interactive Graph Visualization](https://tva1.sinaimg.cn/large/008eGmZEly1gpci0lavnej31gj0u0k1j.jpg)

Visualize your graph in 3D with interactive force-directed layout, with automatic sizing and coloring, and even full control over every node for customization!

### Data Import

![Data Import](https://tva1.sinaimg.cn/large/008eGmZEly1gpci1ctqc1j313h0u0jwe.jpg)

PiperNet accepts both the CSV and [GEXF](https://gephi.org/gexf/format/) inputs. The following possible approaches are the several ways you can import data to this application.

---

**- Importing nodes with labels and their relations**

The easiest is probably to just have a csv file like this one:

```
Source,    Target
Jeremy,    Jennifer
Valerian,  Jeremy
```

or

```
Source, Target, Weight,   Where first met
1,      45,     3,        London
```

which specify the simple undirected relationship between `Source` and `Target`, other fields are optional.

**- Importing more than labels: nodes and edges attributes**

To import attributes we will need to proceed on, choose "I want to import Node file" and specify one for the list of nodes.

Nodes must have at least an **`ID`** (you can specify which column is the ID), other fields are optional, an example file with a list of nodes:

```

Id, Label, Date of Birth, Place of Birth, Years of experience, Rating
3, Dubois, 17/09/1980, Paris, 8, 9.27
1, Jeremy, 25/03/1978, Tampa, 8, 4.34
45, Rodriguez, 30/04/1985, Berlin, 5, 6.66

```

**- Importing with GEXF format**

[GEXF](https://gephi.org/gexf/format/) (Graph Exchange XML Format) is a language for describing complex networks structures, their associated data and dynamics. PiperNet can import and export GEXF files with all necessary graph data stored in it.

The [Dynamic GEXF](https://gephi.org/gexf/format/dynamics.html) is currently not yet supported in PiperNet, and might not support unless enough functionalities added to enhance the interactivity of Dynamic GEXF.

### Graphs for Testing and Demos

[Sample Datasets](https://github.com/grp202004/PiperNet/tree/master/src/samples) are located inside this repository and can be downloaded in this [link](https://www.mediafire.com/file/wwd0bdp82kmbdgc/samples.zip/file), enjoy and have fun :\)

### Data Visualization in 3D

To view the graph from different angle and size, the following operations can be applied:

-   Rotate: hold the left mouse
-   Pan: hold the right mouse
-   Zoom: mouse wheel

For more details of a certain node, mouse hovering can show a label of the node ID while the node and edges linked to it turn red, with detailed information of the node such as node ID and other attributes being displayed in a table that is editable on the right-top corner.

### 3D Clusters

Choose **Clustered by** at the top-right of the scene. All attributes of the nodes will be shown in the menu. By default, the cluster is none and no cluster is formed. When a new attribute is picked for cluster, the graph will be refreshed. Nodes in different clusters will be packed by spheres or convex hull (can be set in Graph Options on the left panel) in different colors.

Users are also allowed to define clusters by themselves. The selected nodes can form new clusters, and the clusters properties can be changed in data sheets.

### Node and Edge Datasheet

![Node and Edge Datasheet](https://tva1.sinaimg.cn/large/008eGmZEly1gpci26tlnsj316w0u0tnb.jpg)

The node and edge datasheet shows the detailed information as well as various operation on the node and edge, including but not limited to: **Add** new Nodes and Edges, **Delete** Nodes and Edges, **Search** and **Filter** the table, **Alter** the attributes...

### Multi-selection

![Multi-selection](https://tva1.sinaimg.cn/large/008eGmZEly1gpci48v1smj30wh0u0jym.jpg)

Switch to **Node Selection** mode. By defalut, left click the nodes to select or deselect the nodes.
Choose **Box Selection** and hold the mouse to draw a rectangle for node selection. The nodes' details are shown in the bottom table. The selected nodes are able to be deleted or form new clusters through context menu.

### Context Menu

![Context Menu](https://tva1.sinaimg.cn/large/008eGmZEly1gpci5onrq0j30g40jy764.jpg)

right-click on the background or specific node to activate context menu, with rich buttons click: Add Node, Add Edge, Delete Node, Delete Edge, Form a new cluster, Cancel Selection ans Delete Selected Nodes.

-   Add Node: add a new node on the stage
-   Delete Edge: after clicking Delete Edge, hover the mouse on the candidate edge (listed in the right-bottom corner to preview the edge to be deleted)
-   Form a new cluster: after node selection and clicking Form a new cluster, a new cluster is generated containing these selected nodes
-   Release from cluster: the selected nodes will be free from the cluster group
-   Cancel Selection: Cancel selection on nodes
-   Delete Selected Nodes: delete selected nodes in dispatch
-   Add Edge: choose the source node ID and target node ID to form a new edge
-   Delete Node: delete the single selected node

### Graph Options

![Graph Options](https://tva1.sinaimg.cn/large/008eGmZEly1gpci72k6z4j30iy15kq6o.jpg)

Graph Options are used to change the style of the graph. The colors, shapes, size of nodes, edges, labels and clusters can be modified in this menu.

### Search

![Search](https://tva1.sinaimg.cn/large/008eGmZEly1gpci7za2joj30iu0l2age.jpg)

Search nodes through their ID or other properties.

### Merge Cluster

Merge Several clusters into one cluster in **Cluster Selection** mode.

### Release Cluster

Free all nodes in one cluster in **Cluster Selection** mode.

### Split Cluster

![Split Cluster](https://tva1.sinaimg.cn/large/008eGmZEly1gpci8nuej0j318q0u0wss.jpg)

Split one cluster to two clusters following instructions in **Cluster Splitting** mode.

### Export Data

The fixed data can be exported to both the CSV and [GEXF](https://gephi.org/gexf/format/) files.

```

```

♥ Developed and maintained by [UNNC GRP 2020.04](https://github.com/grp202004). We are happy to accept any contribution to help make PiperNet better, and we are welcome to any issues raising and features advice.
