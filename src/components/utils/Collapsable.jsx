import React from "react";
import { Button, Classes, Collapse, Card, Elevation } from "@blueprintjs/core";
import classnames from "classnames";

export default ({ name, isOpen, onToggle, children }) => (
    <Card elevation={Elevation.THREE}>
        <Button
            className={classnames(
                Classes.LARGE,
                Classes.FILL,
                "text-align-left"
            )}
            rightIcon={isOpen ? "chevron-up" : "chevron-down"}
            onClick={onToggle}
        >
            {name}
        </Button>
        <Collapse isOpen={isOpen}>{children}</Collapse>
    </Card>
);
