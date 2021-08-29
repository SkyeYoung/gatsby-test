import React from "react";
import {WrapPageElementNodeArgs, WrapRootElementBrowserArgs} from "gatsby";
import {i18n, InitOptions} from "i18next";
import {I18nPageContext} from "./gatsby-node";

export type LngOption = {
    storeKey: string;
    supportedLngs: {
        [key: string]: string
    },
    docName: string;
    i18n: InitOptions
}

export type LngSupport = {
    siteSupport: boolean;
    pageSupport: boolean;
}

export type Info = LngOption

export type Util = {
    detectedLng: string;
    changeLng: (lng: string) => Promise<LngSupport>
}

export declare const changeLng: (i18n: i18n, i18nPageContext: I18nPageContext, storeKey: string, supportedLngs: string[], lng) => Promise<LngSupport>

export declare const I18nInfoContext: React.Context<Info>
export declare const I18nUtilContext: React.Context<Util>

export declare const WrapRootElement: (args: WrapRootElementBrowserArgs, option: LngOption) => JSX.Element
export declare const WrapPageElement: (args: WrapPageElementNodeArgs, option: LngOption) => JSX.Element
