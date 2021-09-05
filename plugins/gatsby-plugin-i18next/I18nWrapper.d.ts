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

export type SiteInfo = LngOption

export type PageInfo = {
    lng: string;
    supportLngs: string;
    detectLng: () => string;
    changeLng: (lng: string) => Promise<LngSupport>,
    parseUrl: () => {
        url: string;
        lng: string;
    }
}

export declare const changeLng: (i18n: i18n, i18nPageContext: I18nPageContext, storeKey: string, supportedLngs: string[], lng) => Promise<LngSupport>

export declare const I18nSiteInfoContext: React.Context<SiteInfo>
export declare const I18nPageInfoContext: React.Context<PageInfo>

export declare const WrapRootElement: (args: WrapRootElementBrowserArgs, option: LngOption) => JSX.Element
export declare const WrapPageElement: (args: WrapPageElementNodeArgs, option: LngOption) => JSX.Element
