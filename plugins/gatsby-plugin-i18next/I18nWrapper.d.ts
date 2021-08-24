import React from "react";
import {WrapPageElementNodeArgs, WrapRootElementNodeArgs} from "gatsby";

export type Language = {
    fallbackLng: string;
    supportedLngs: string[];
    ns: string[];
}

export declare const I18nInfoContext: React.Context<Language>

export declare function Provider(args: Omit<WrapRootElementNodeArgs, 'element'>, options: Language);

export declare function Layout(args: Omit<WrapPageElementNodeArgs, 'element' | 'props'>): JSX.Element
