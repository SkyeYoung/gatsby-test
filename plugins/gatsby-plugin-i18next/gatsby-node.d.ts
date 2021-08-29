import {CreatePageArgs} from "gatsby";
import {LngOption} from "./I18nWrapper";

export declare const onCreatePage: (args: CreatePageArgs, option: LngOption) => void;

export type I18nPageContext = {
    isFallback: boolean;
    fallbackLng: string;
    lng: string;
    lngs: string[];
}
