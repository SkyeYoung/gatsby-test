import React from "react";
import {WrapRootElementNodeArgs} from "gatsby";

export type lngOption = {
    storeKey: string;
    supportedLngs: {
        [key: string]: string
    },
    i18n: {
        fallbackLng: string;
        ns: string[];
    }
}

export type Info = {
    lng: string;
    fallbackLng: string;
    supportedLngs: lngOption["supportedLngs"],
    ns: string[];
}

export declare const I18nInfoContext: React.Context<Info>

export declare const WrapPageElement: (args: WrapRootElementNodeArgs) => JSX.Element
