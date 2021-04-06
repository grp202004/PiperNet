import { Intent, Position, Toaster, ToasterPosition } from "@blueprintjs/core";
import React from "react";

export function createToaster(
    message: React.ReactNode,
    position: ToasterPosition = Position.TOP,
    timeout: number = 5000
) {
    Toaster.create({
        position: position,
    }).show({
        message: message,
        intent: Intent.NONE,
        timeout: timeout,
    });
}
