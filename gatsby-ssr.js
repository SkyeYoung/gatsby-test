import WrapRootElement from "./src/components/WrapRootElement";
import {enableStaticRendering} from "mobx-react-lite";
import OnRenderBody from "./src/components/OnRenderBody";

enableStaticRendering(true)

export const wrapRootElement = WrapRootElement

export const onRenderBody = OnRenderBody
