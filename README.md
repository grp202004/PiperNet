# PiperNet

![Deploy master to GitHub Pages](https://github.com/grp202004/PiperNet/workflows/Deploy%20master%20to%20GitHub%20Pages/badge.svg?branch=master) ![Coveralls](https://github.com/grp202004/PiperNet/workflows/Coveralls/badge.svg)

An interactive 2D/3D cluster graph visualization system that runs in your browsers as well as on desktop.

[**Stable Beta** - Launch stable beta version of PiperNet in your browser](https://grp202004.github.io/pipernet.github.io/)

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

### More Features on the Way !

This project is currently under development, and we have a lot more existing new features coming soon.

```

```

♥ Developed and maintained by [UNNC GRP 2020.04](https://github.com/grp202004). We are currently not accepting any contribution from other than the team members.
