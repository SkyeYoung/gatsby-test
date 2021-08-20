import {action, computed, observable} from "mobx";

interface SidebarStore {
    collapsed: boolean;

    get width(): number;

    get toLeft(): number;

    toggle(): void;
}

const sidebarStore = observable<SidebarStore>({
    collapsed: false,
    get width() {
        return 250;
    },
    get toLeft() {
        return this.collapsed ? 0 : -this.width
    },
    toggle() {
        this.collapsed = !this.collapsed
    },
}, {
    collapsed: observable,
    width: computed,
    toLeft: computed,
    toggle: action.bound,
}, {proxy: false})


interface HeaderStore {
    appear: boolean;

    get height(): number;
}

const headerStore = observable<HeaderStore>({
    appear: true,
    get height() {
        return 60
    }
}, {
    appear: observable,
    height: computed
}, {proxy: false})


interface InfoStore {
    title: string,
}

const infoStore = observable<InfoStore>({
    title: '',
}, {
    title: observable,
}, {proxy: false})


export {
    sidebarStore, headerStore, infoStore
}
