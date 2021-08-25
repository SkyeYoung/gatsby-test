import React from "react";
import {enableStaticRendering} from "mobx-react-lite";
import Provider from "./src/components/Provider";

enableStaticRendering(true)

export const wrapRootElement = ({element}) => {
    return <Provider>{element}</Provider>
}
