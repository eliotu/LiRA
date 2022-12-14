
import { latLng, map } from 'Leaflet.MultiOptionsPolyline';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { Tooltip } from 'react-leaflet';
import { HotlineOptions } from 'react-leaflet-hotline';
import { HotlineEventHandlers } from 'react-leaflet-hotline/lib/types';
import { useGraph } from '../../context/GraphContext';
import { FilteringOptions } from '../../models/models';
import { WaysConditions } from '../../models/path';
import { getWaysConditions } from '../../queries/conditions';
import createPopup from '../createPopup';
import useZoom from '../Map/Hooks/useZoom';
import DistHotline from '../Map/Renderers/DistHotline';
import FilteringSelector from './OptionsFiltering';

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number,filter:number) => void;
}

const Ways: FC<IWays> = ( { palette, type, onClick } ) => {
    const zoom = useZoom();
    const { minY, maxY } = useGraph()

    const [ways, setWays] = useState<WaysConditions>()
    const [count, setCount] = useState(0);

    const onChange=({search}: FilteringOptions) =>{
        const number=Number(search)
       
        if(!isNaN(number)){
            setCount(number);
        }
     


    }


    const options = useMemo<HotlineOptions>( () => ({
        palette, min: minY, max: maxY, tolerance:count
    } ), [palette, minY, maxY,count] )

    const handlers = useMemo<HotlineEventHandlers>( () => ({
        click: (_, i) => {
           /**  if(filter){
                const popup=createPopup();
                popup( {
                    icon: "warning",
                    title: `This trip doesn't have any value with the ira wanted   `,
                    toast: true
                } );
        }**/
            console.log("there is a problem");
            if ( ways && onClick )
                onClick(ways.way_ids[i], ways.way_lengths[i],count)
        },
     


    }), [count,ways] )

    useEffect( () => {
        if ( zoom === undefined ) return;
        const z = Math.max(0, zoom - 12)
        getWaysConditions(type, z, (data: WaysConditions) => {
            setWays( data )
        } )
    }, [zoom] )

    return (
        <>
        { ways 
            ? <><DistHotline
                    way_ids={ways.way_ids}
                    geometry={ways.geometry}
                    conditions={ways.conditions}
                    options={options}
                    eventHandlers={handlers}
                    filter={count} /><Tooltip> xdn </Tooltip></>

            : null 
        }

        <div className='toolbar-wrapper'>

            <FilteringSelector onChange={onChange}/>

        </div>
        </>

    )
}

export default Ways;