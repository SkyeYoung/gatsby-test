import React from "react";
import {WrapPageElementNodeArgs, WrapRootElementBrowserArgs} from "gatsby";
import {InitOptions} from "i18next";

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

export type Info = {
    lng: string;
    fallbackLng: string;
    supportedLngs: LngOption["supportedLngs"],
    ns: string[];
    changeLng: (lng: string) => Promise<LngSupport>
}

export declare const I18nInfoContext: React.Context<Info>

export declare const WrapRootElement: (args: WrapRootElementBrowserArgs, option: LngOption) => JSX.Element
export declare const WrapPageElement: (args: WrapPageElementNodeArgs, option: LngOption) => JSX.Element
