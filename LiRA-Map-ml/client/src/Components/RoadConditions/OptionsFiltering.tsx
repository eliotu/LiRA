import { FC, useState } from "react";
import DatePicker from "react-date-picker";
import { FilteringOptions, TripsOptions } from "../../models/models";
import Checkbox from "../Checkbox";

const defaultOptions: FilteringOptions = {
    search: '',
}
    

interface IOptionsSelector {
    onChange: ( options: TripsOptions ) => void;
}

const FilteringSelector: FC<IOptionsSelector> = ( { onChange } ) => {

    const [options, setOptions] = useState<FilteringOptions>(defaultOptions)

    const _onChange = (key: keyof TripsOptions) => {
        return function<T>(value: T) 
        {
            const temp = { ...options } as any
            temp[key] = value;
            setOptions(temp)
            onChange(temp)
        }
    } 

    return (
        <div className="rides-options">
            <input 
                className="ride-search-input" 
                placeholder='Filter..' 
                value={options.search} 
                onChange={e => _onChange('search')(e.target.value)} />

          
        </div>
        
    )
}

export default FilteringSelector;