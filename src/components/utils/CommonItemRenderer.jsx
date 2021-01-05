import React from "react";
import { Classes, MenuItem } from "@blueprintjs/core";

export default (item, { handleClick, isActive }) => (
    <MenuItem
        className={isActive ? Classes.ACTIVE : ""}
        key={item}
        onClick={handleClick}
        text={item}
    />
);
