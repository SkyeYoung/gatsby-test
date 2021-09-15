import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {autorun} from "mobx";
import {VARS_STORE_ID, varsStore} from "../stores/css-vars-store";

const StoreHandler: React.FC = observer(() => {

    autorun(() => {
        if (varsStore.styleEl === null && typeof window !== 'undefined') {
            varsStore.setStyleEl(document.getElementById(VARS_STORE_ID))
        }

        if (varsStore.styleEl !== null) {
            varsStore.styleEl.innerHTML = varsStore.computedCSS.styles
        }
    })

    useEffect(() => {
        return () => {
            varsStore.stopStore()
        };
    }, []);

    return <></>
})

export default StoreHandler
