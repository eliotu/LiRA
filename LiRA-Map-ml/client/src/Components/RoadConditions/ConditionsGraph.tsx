import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { ChartData, Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ActiveElement, ChartEvent, ChartOptions, ChartTypeRegistry, Plugin  } from "chart.js";
import { Color, Palette } from "react-leaflet-hotline";
import { Line } from "react-chartjs-2";

import { ConditionType } from "../../models/graph";

Chart.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

const options = ({name, min, max}: ConditionType): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
            labels: { color: 'white' },
        },
    },
    scales: {
        x: {
            title: { 
                display: true, 
                text: 'distance  bonne tuds cdskle (m)' 
            },
            ticks: { 
                maxTicksLimit: 30,
                stepSize: 200, 
                callback: (tick: string | number) => Math.round(parseFloat(tick.toString())) 
            }
        },
        y: {
            title: { 
                display: true, 
                text: name
            },
            min: min,
            max: max
        }
    }
});

const addPaletteChart = (chart: Chart<keyof ChartTypeRegistry, number[], unknown>, palette: Palette) => {
    const dataset = chart.data.datasets[0];
    const gradient = chart.ctx.createLinearGradient(0, chart.chartArea.bottom, 0, 0);
    palette.forEach( (c: Color) => {
        gradient.addColorStop(c.t, `rgb(${c.r}, ${c.g}, ${c.b})`);
    })
    dataset.borderColor = gradient;
    dataset.backgroundColor = gradient;
}

interface Props {
    type: ConditionType;
    data: ChartData<"line", number[], number> | undefined
    palette: Palette;
}

const ConditionsGraph: FC<Props> = ( { type, data, palette } ) => {

    const ref = useRef<Chart<"line", number[], number>>(null)

    useEffect( () => {
        if (ref.current === null ) return;
        const chart = ref.current;
        addPaletteChart(chart, palette)
        chart.update()
    }, [ref, data, palette])

    // attach events to the graph options


    // click one point in the graph maybe another extension 
    const graphOptions: ChartOptions<'line'> = useMemo( () => ({
        ...options(type),
        onClick: (event: ChartEvent, elts: ActiveElement[], chart: Chart<keyof ChartTypeRegistry, number[], unknown>) => {
            if ( elts.length === 0 ) return;
            const elt = elts[0] // doesnt work if multiple datasets
            const pointIndex = elt.index
            console.log(pointIndex, event, elts);
        }
    }), [] )

    return (
        <div className="road-conditions-graph">
            { data && <Line
                ref={ref} 
                data={data} 
                options={graphOptions}  />  
            }
        </div>
    )
}

export default ConditionsGraph;