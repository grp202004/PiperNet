import React from "react";
import classnames from "classnames";
import uniq from "lodash/uniq";
import { Classes } from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
// import State from "../../state/index";
import { observer } from "mobx-react";
import State from "../../state/index";

export default observer(
  class NodeDetail extends React.Component {
    render() {
      // If input is number,
      // currently format number between 0-1 (eg. pagerank)
      // to show no more than 3 significant digits.
      const formatLongFloat = (nodeAttributeValue: any) => {
        const num = Number(nodeAttributeValue);
        if (Number.isNaN(num) || num > 1 || num < 0) {
          // Do not format just return original
          return nodeAttributeValue;
        }
        // Format to no more than 3 significant digit.
        return Number.parseFloat(num.toString()).toPrecision(3);
      };

      const cellRenderer_property = (rowIndex: number) => {
        return <Cell>{State.graph.metadata.nodeProperties[rowIndex]}</Cell>
      };

      const cellRenderer_value = (rowIndex: number) => {

        return <Cell>{State.graph.rawGraph.getNodeAttribute(State.graph.currentlyHoveredId as string, State.graph.metadata.nodeProperties[rowIndex])}</Cell>
      };



      return (
        <div
          className={classnames(
            // 'overlay-card',
            "right-overlay-card",
            "transparent-frame"
          )}
        >

          {/* need to change */}
          <div className={classnames(Classes.CARD, "node-details-table")}>

            {/* use foreach */}

            <Table numRows={State.graph.metadata.nodeProperties.length}>
              <Column name="Properties" cellRenderer={cellRenderer_property} />
              <Column name="Value" cellRenderer={cellRenderer_value} />
            </Table>
          </div>
        </div>
      );
    }
  }
);
// export default NodeDetail;