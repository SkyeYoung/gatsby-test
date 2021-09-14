import React, {useCallback, useMemo} from "react";
import {observer} from "mobx-react-lite";
import Box from "@material-ui/core/Box";
import {ModeLabel, varsStore} from "../../stores/css-vars-store";
import {RgbaStringColorPicker} from "react-colorful";
import {Typography} from "@material-ui/core";

interface PaletteProps {
    label: ModeLabel,
    attr: string
}

const Palette: React.FC<PaletteProps> = observer((props) => {
    const {label, attr} = props
    const color = useMemo(() => varsStore.getWithKey(label, attr), [varsStore, label, attr])
    const setColor = useCallback((newColor: string) => {
        const val = newColor.match(/^rgba\((.+)\)$/)
        if (val) {
            varsStore.setWithKey(label, attr, val[1])
        }
    }, [])

    return (
        <Box>
            <Typography>{attr}</Typography>
            <RgbaStringColorPicker color={color} onChange={setColor}/>
        </Box>
    )
})

const Palettes: React.FC = observer(() => {
    return (
        <Box>
            {Array.from(varsStore.light.keys()).map((v) =>
                <Palette key={v} label={'light'} attr={v}/>
            )}
        </Box>
    )
})

export default Palettes
