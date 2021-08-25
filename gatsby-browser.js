import Provider from "./src/components/Provider";
import React from "react";

export const wrapRootElement = ({element}) => {
    return <Provider>{element}</Provider>
}
