import { Combobox } from './Combobox';

interface Category { id:number;name:string;color?:string;type?:string }
interface CategorySelectProps { label?:string;value:string|number;onChange:(value:string)=>void;options:Category[];error?:string;placeholder?:string;className?:string;required?:boolean;disabled?:boolean;help?:string }
export function CategorySelect({options,onChange,...props}:CategorySelectProps){return <Combobox {...props} searchable options={options.map(option=>({value:String(option.id),label:option.name}))} onChange={value=>onChange(String(value))}/>}
