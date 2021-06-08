import { Button, Icon, InputGroup, Intent } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../state";
import { handleStringChange, parseNumberOrString } from "./InputFormUtils";
import FormClusterOptionsCard from "./FormClusterOptionsCard";

export default observer(
    class FormTwoClusterOptionsCard extends FormClusterOptionsCard {
        state = {
            selectedAttribute: State.cluster.clusterBy,
            value: "" as string,
            anotherValue: "" as string,
        };

        renderInput() {
            return (
                <>
                    <div className="horizontal-gap"></div>
                    <InputGroup
                        leftElement={<Icon icon="tag" />}
                        onChange={handleStringChange((value) => {
                            this.setState({ value: value });
                        })}
                        placeholder="Enter Clustering Value for nodes in white"
                        value={this.state.value}
                        intent={
                            this.state.value === ""
                                ? Intent.DANGER
                                : Intent.SUCCESS
                        }
                    />
                    <div className="horizontal-gap"></div>
                    <InputGroup
                        leftElement={<Icon icon="tag" />}
                        onChange={handleStringChange((value) => {
                            this.setState({ anotherValue: value });
                        })}
                        placeholder="Enter Clustering Value for nodes in red"
                        value={this.state.anotherValue}
                        intent={
                            this.state.anotherValue === ""
                                ? Intent.DANGER
                                : Intent.SUCCESS
                        }
                    />
                    <div className="horizontal-gap"></div>
                    <Button
                        onClick={() => {
                            this.props.callback(
                                this.state.selectedAttribute as string,
                                parseNumberOrString(this.state.value),
                                parseNumberOrString(this.state.anotherValue)
                            );
                        }}
                        intent={Intent.SUCCESS}
                        disabled={
                            this.state.selectedAttribute === null ||
                            this.state.value === "" ||
                            this.state.anotherValue === ""
                        }
                    >
                        Confirm
                    </Button>
                </>
            );
        }
    }
);
