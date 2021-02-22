import React, { ReactNode } from "react";
import { Button, Card, Classes, Collapse, Elevation } from "@blueprintjs/core";
import classnames from "classnames";
import { observer } from "mobx-react";

interface Props {
    name: string;
    isOpen: boolean;
    onToggle: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    children: ReactNode;
}

export default observer(
    class SimpleSelect extends React.Component<Props, {}> {
        render() {
            return (
                <Card elevation={Elevation.THREE}>
                    <Button
                        className={classnames(
                            Classes.LARGE,
                            Classes.FILL,
                            "text-align-left"
                        )}
                        rightIcon={
                            this.props.isOpen ? "chevron-up" : "chevron-down"
                        }
                        onClick={this.props.onToggle}
                    >
                        {this.props.name}
                    </Button>
                    <Collapse isOpen={this.props.isOpen}>
                        {this.props.children}
                    </Collapse>
                </Card>
            );
        }
    }
);
