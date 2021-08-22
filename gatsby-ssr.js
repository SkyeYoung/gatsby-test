import React from "react";
import {enableStaticRendering} from "mobx-react-lite";
import Provider from "./src/components/Provider";
import Layout from "./src/components/Layout";

enableStaticRendering(true)

export const wrapPageElement = ({element, props}) => {
    return <Layout {...props}>{element}</Layout>
}

export const wrapRootElement = ({element}) => {
    return <Provider>{element}</Provider>
}
