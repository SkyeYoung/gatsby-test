import {makePersistable} from "mobx-persist-store";
import * as localforage from "localforage";
import {PersistenceStorageOptions} from "mobx-persist-store/lib/esm2017/types";
import {IReactionOptions} from "mobx";


type PersistStore = <T extends {
    [key: string]: any;
}, P extends keyof T>(target: T, storageOptions: PersistenceStorageOptions<P>, reactionOptions?: IReactionOptions) => void;

const persistStore: PersistStore = (store, storageOption, reactionOption) => {
    if (typeof window === 'undefined') return

    const persistStorage = localforage.createInstance({
        name: "persist-info"
    });

    makePersistable(
        store,
        {
            storage: persistStorage,
            // one day
            expireIn: 24 * 60 * 60 * 1000,
            removeOnExpiration: true,
            stringify: false,
            debugMode: process.env.NODE_ENV === 'development',
            ...storageOption
        },
        {
            delay: 200,
            ...reactionOption
        }
    ).then((persistStore) => {
        console.log(persistStore.isHydrated)
    })
}

export default persistStore
