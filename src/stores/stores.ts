import {action, computed, observable} from "mobx";

interface SidebarStore {
    collapsed: boolean;

    get width(): number;

    get toLeft(): number;

    setCollapsed(val: boolean): void;

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
    setCollapsed(val: boolean) {
        this.collapsed = val
    },
    toggle() {
        this.collapsed = !this.collapsed
    },
}, {
    collapsed: observable,
    width: computed,
    toLeft: computed,
    toggle: action.bound,
    setCollapsed: action.bound
}, {})


interface HeaderStore {
    appear: boolean;

    get height(): number;

    setAppear(val: boolean): void;
}

const headerStore = observable<HeaderStore>({
    appear: true,
    get height() {
        return 60
    },
    setAppear(val: boolean) {
        this.appear = val
    }
}, {
    appear: observable,
    height: computed,
    setAppear: action.bound
})


interface InfoStore {
    title: string,

    setTitle(val: string): void;
}

const infoStore = observable<InfoStore>({
    title: '',
    setTitle(val: string): void {
        this.title = val
    },
}, {
    title: observable,
    setTitle: action.bound
})


export {
    sidebarStore, headerStore, infoStore
}
