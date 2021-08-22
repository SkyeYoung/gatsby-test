import Layout from "./src/components/Layout";
import Provider from "./src/components/Provider";
import React from "react";

export const wrapPageElement = ({element, props}) => {
    return <Layout  {...props}>{element}</Layout>
}

export const wrapRootElement = ({element}) => {
    return <Provider>{element}</Provider>
}
