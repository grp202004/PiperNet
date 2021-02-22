import React, { ReactNode } from "react";
import { Classes, Collapse, Switch } from "@blueprintjs/core";
import { observer } from "mobx-react";

interface Props {
    name: string;
    isOpen: boolean;
    onToggle: (event: React.FormEvent<HTMLInputElement>) => void;
    children: ReactNode;
}

export default observer(
    class SwitchCollapsable extends React.Component<Props, {}> {
        render() {
            return (
                <div>
                    <Switch
                        label={this.props.name}
                        checked={this.props.isOpen}
                        onChange={this.props.onToggle}
                        className={Classes.ALIGN_RIGHT}
                    />
                    <Collapse isOpen={this.props.isOpen}>
                        {this.props.children}
                    </Collapse>
                </div>
            );
        }
    }
);
