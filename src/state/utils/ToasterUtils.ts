import { Intent, Position, Toaster, ToasterPosition } from "@blueprintjs/core";
import React from "react";

export function createToaster(
    message: React.ReactNode,
    position: ToasterPosition = Position.TOP,
    timeout: number = 5000,
    intent: Intent = Intent.NONE
) {
    Toaster.create({
        position: position,
    }).show({
        message: message,
        intent: intent,
        timeout: timeout,
    });
}
