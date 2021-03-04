# PiperNet

![Deploy master to GitHub Pages](https://github.com/grp202004/PiperNet/workflows/Deploy%20master%20to%20GitHub%20Pages/badge.svg?branch=master) ![Coveralls](https://github.com/grp202004/PiperNet/workflows/Coveralls/badge.svg)

An interactive 2D/3D cluster graph visualization system that runs in your browsers as well as on desktop.

[**Stable Beta** - Launch stable beta version of PiperNet in your browser](https://grp202004.github.io/pipernet.github.io/)

[**Documentation** - Documentation of this project](https://grp202004.github.io/PiperNet-Docs/)

[**Canary** - Launch early access canary version of PiperNet in your browser](https://kaby-lake.github.io/pipernetDev.github.io/)

## About

This project aims to help researchers map the existing information onto the 2D or 3D graphs, and discover the undetected details behind the real-world datasets, as well as modify them in various ways.

## Feature Highlights

### Interactive Graph Visualization

Visualize your graph in 2D or 3D with interactive force-directed layout, with automatic sizing and coloring, and even full control over every node for customization!

### Data Import

PiperNet accepts both the CSV and [GEXF](https://gephi.org/gexf/format/) inputs. The following possible approaches are the several ways you can import data to this application.

---

**- Importing nodes with labels and their relations**

The easiest is probably to just have a csv file like this one:

```
Source,    Target
Jeremy,    Jennifer
Valerian,  Jeremy
```

which specify the simple undirected relationship between `Source` and `Target`. This type of input kind can be achieved by selecting "**only edge file**" on import dialog.

---

**- Importing more than labels: nodes and edges attributes**

To import attributes we will need to proceed differently. We need 2 csv files: one for the list of nodes, one for the list of relations (edges)

Nodes must have at least an **`ID`** (you can specify which column is the ID), other fields are optional, an example file with a list of nodes:

```
Id, Label,      Date of Birth,  Place of Birth,    Years of experience,    Rating
3,  Dubois,     17/09/1980,     Paris,             8,                      9.27
1,  Jeremy,     25/03/1978,     Tampa,             8,                      4.34
45, Rodriguez,  30/04/1985,     Berlin,            5,                      6.66
```

Edges must have at least a **`Source`** and **`Target`**, other fields are optional, an example file with a list of edges:

```
Source, Target, Weight,   Where first met
1,      45,     3,        London
```

**- Importing with GEXF format**

[GEXF](https://gephi.org/gexf/format/) (Graph Exchange XML Format) is a language for describing complex networks structures, their associated data and dynamics. PiperNet can import and export GEXF files with all necessary graph data stored in it.

The [Dynamic GEXF](https://gephi.org/gexf/format/dynamics.html) is currently not yet supported in PiperNet, and might not support unless enough functionalities added to enhance the interactivity of Dynamic GEXF.

### Graphs for Testing and Demos

[Sample Datasets](./src/samples/) are located inside this repository, enjoy and have fun :\)

### Data Visualization in 3D

To view the graph from different angle and size, the following operations can be applied:

-   Rotate: hold the left mouse
-   Pan: hold the right mouse
-   Zoom: mouse wheel

For more details of a certain node, mouse hovering can show a label of the node ID while the node turns red, with detailed information of the node such as node ID and other attributes being displayed in a table that is editable on the right-top corner

### 3D Clusters

Choose **Clustered by** at the top-right of the scene. All attributes of the nodes will be shown in the menu. By default, the cluster is none and no cluster is formed. When a new attribute is picked for cluster, the graph will be refreshed. Nodes in different clusters will be packed by spheres or convex hull (can be set in Graph Options on the left panel) in different colors.

### Node and Edge Datasheet

The node and edge datasheet shows the detailed information as well as various operation on the node and edge, including but not limited to: **Add** new Nodes and Edges, **Delete** Nodes and Edges, **Search** and **Filter** the table, **Alter** the attributes...

### Multi-selection

Hold **Control** or **Shift** and left click the node to select or deselect the nodes, Rectangular Marquee Selection is on the way...

### Context Menu

right-click on the background or specific node to activate context menu, with rich buttons lick: Add Node, Add Edge, Delete Node and Delete Edge

-   Delete Edge: after clicking Delete Edge, hover the mouse on the candidate edge (listed in the right-bottom corner to preview the edge to be deleted)

### Graph Options

information regarding the graph options is available in the online documentation website.

```

```

♥ Developed and maintained by [UNNC GRP 2020.04](https://github.com/grp202004). We are currently not accepting any contribution from other than the team members, but we are welcome will any issues raising and features advice.
