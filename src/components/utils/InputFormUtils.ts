import { Attributes } from "graphology-types";
import React from "react";

/** Event handler that exposes the target element's value as a boolean. */
export function handleBooleanChange(handler: (checked: boolean) => void) {
    return (event: React.FormEvent<HTMLElement>) =>
        handler((event.target as HTMLInputElement).checked);
}

/** Event handler that exposes the target element's value as a string. */
export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) =>
        handler((event.target as HTMLInputElement).value);
}

/** Event handler that exposes the target element's value as an inferred generic type. */
export function handleValueChange<T>(handler: (value: T) => void) {
    return (event: React.FormEvent<HTMLElement>) =>
        handler(((event.target as HTMLInputElement).value as unknown) as T);
}

/** Event handler that exposes the target element's value as a number. */
export function handleNumberChange(handler: (value: number) => void) {
    return handleStringChange((value) => handler(+value));
}

export function stringifyNodeDetail(attributes: Attributes): string {
    let res = "";
    for (var attribute in attributes) {
        if (
            attributes.hasOwnProperty(attribute) &&
            attribute !== "_visualize" &&
            attribute !== "_options"
        ) {
            res += attribute + " : " + attributes[attribute] + " ; ";
        }
    }

    return res;
}

export function parseNumberOrString(value: string): string | number {
    if (value === "") {
        return "";
    }
    let numberVal = Number(value);
    if (isNaN(numberVal)) {
        return value;
    } else {
        return numberVal;
    }
}
