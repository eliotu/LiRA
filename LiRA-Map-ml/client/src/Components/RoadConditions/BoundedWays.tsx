



/**
 * 
 * NOT REALLY WORKING (but almost I think) 
 * Writing tests for this is advised
 * 
 * Ideally => make it work and use Ways instead of Ways
 * when dealing with large amount of data.
 * 
 * /!\ TO FIX: Ways.tsx AND WithBounds.tsx
 * 
 */




import { FC, useEffect, useState } from 'react';
import { TRGB } from 'react-gradient-hook/lib/types';
import { HotlineOptions } from 'react-leaflet-hotline';
import { LatLngBounds } from 'leaflet';

import { useGraph } from '../../context/GraphContext';

import { WaysConditions } from '../../models/path';

import { getWaysConditions } from '../../queries/conditions';

import DistHotline from '../Map/Renderers/DistHotline';
import WithBounds from '../Map/WithBounds';
import { toMapBounds } from '../Map/utils';
import useZoom from '../Map/Hooks/useZoom';

interface IWays {
    palette: TRGB[]
    type: string;
    onClick?: (way_id: string, way_length: number) => () => void;
}

const Ways: FC<IWays> = ( { palette, type, onClick } ) => {
    
    const zoom = useZoom();
    const { minY, maxY } = useGraph()

    const [ways, setWays] = useState<WaysConditions>()
    const [options, setOptions] = useState<HotlineOptions>({});

    useEffect( () => {
        setOptions( { palette, min: minY, max: maxY } )
    }, [palette, minY, maxY])

    const request = async (bounds: LatLngBounds) => {
        if ( zoom === undefined ) return;
        const z = Math.max(1, zoom - 12)
        const { data } = await getWaysConditions(toMapBounds(bounds), type, z)
        setWays( data )
        if ( onClick )
            setTimeout( onClick(data.way_ids[0], data.way_lengths[0]), 100 )
            console.log("Ways");
    }

    return (
        <WithBounds onChange={request} padding={0.1}>
            { ways 
                ? <DistHotline 
                    way_ids={ways.way_ids}
                    geometry={ways.geometry}
                    conditions={ways.conditions} 
                    options={options}
                    filter={4} /> 
                : null 
            }
        </WithBounds>
    )
}

export default Ways;