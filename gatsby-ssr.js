import WrapRootElement from "./src/components/gatsby-wrapper/WrapRootElement";
import {enableStaticRendering} from "mobx-react-lite";
import OnRenderBody from "./src/components/gatsby-wrapper/OnRenderBody";

enableStaticRendering(true)

export const wrapRootElement = WrapRootElement

export const onRenderBody = OnRenderBody
