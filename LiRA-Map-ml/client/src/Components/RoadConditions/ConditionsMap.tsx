
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { ChartData } from "chart.js";
import { Palette } from "react-leaflet-hotline";

import MapWrapper from "../Map/MapWrapper";
import { RENDERER_PALETTE } from "../Map/constants";
import PaletteEditor from "../Palette/PaletteEditor";
import Ways from "./Ways";

import useSize from "../../hooks/useSize";

import { ConditionType } from "../../models/graph";
import { Condition } from "../../models/path";

import { getConditions } from "../../queries/conditions";
import { filter } from "d3";
import createPopup from "../createPopup";
import FilteringSelector from "./OptionsFiltering"
import { FilteringOptions } from "../../models/models";

interface Props {
    type: ConditionType;
    palette: Palette;
    setPalette: React.Dispatch<React.SetStateAction<Palette>>;
    setWayData: React.Dispatch<React.SetStateAction<ChartData<"line", number[], number> | undefined>>;
}

const ConditionsMap: FC<Props> = ( { type, palette, setPalette, setWayData } ) => {

    const { name, max, grid, samples } = type;

    const ref = useRef(null);
    const [width, _] = useSize(ref)


    const [count, setCount] = useState(0);

    const onChange=({search}: FilteringOptions) =>{
        const number=Number(search)
       
        if(!isNaN(number)){
            setCount(number);
        }


    }

    const onClick = (way_id: string, way_length: number) => {
        getConditions( way_id, name, (wc: Condition[]) => {
            const max = wc.reduce((prev, current) => (prev.value > current.value) ? prev : current).value
            console.log(max)

            console.log("the filter right now is :",count);
            if(max>count){

           
                setWayData( {
                    labels: wc.map( p => p.way_dist * way_length ),
                    datasets: [ {
                        type: 'line' as const,
                        label: way_id,
                        borderColor: 'rgb(160,32,240)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        data: wc.map( p => p.value ),
                    } ]
                } )

            }
            else{
                const popup=createPopup();
                popup( {
                    icon: "warning",
                    title: `This trip doesn't have any value with the ira wanted   `,
                    toast: true
                } );
                setWayData( {
                    labels: [],
                    datasets: [ {
                        type: 'line' as const,
                        label: way_id,
                        borderColor: 'rgb(160,32,240)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                        data: [],
                    } ]
                } )

            }
           
        } )
    

    console.log(filter);

    return (
        <div className="road-conditions-map" ref={ref}>
             <FilteringSelector onChange={onChange}/>

            <PaletteEditor 
                defaultPalette={RENDERER_PALETTE}
                width={width}
                cursorOptions={ { scale: max, grid, samples } }
                onChange={setPalette} />

            <MapWrapper>
                <Ways palette={palette} type={name} onClick={onClick}  />

            </MapWrapper>
        </div>
    )
}

export default ConditionsMap;