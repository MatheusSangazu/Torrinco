import { Combobox, type ComboboxOption, type ComboboxProps } from './Combobox';
import { Select } from './Select';

export type Option=ComboboxOption;
export type CustomSelectProps=ComboboxProps;

export function CustomSelect(props:CustomSelectProps){
  if(props.searchable||props.options.length>8)return <Combobox {...props}/>;
  const {value,onChange,options,placeholder='Selecione...',className='',searchable:_searchable,...field}=props;
  const emptyOption=options.find(option=>String(option.value)==='');
  return <div className={className}><Select {...field} value={String(value)} onChange={event=>{const option=options.find(item=>String(item.value)===event.target.value);onChange(option?.value??event.target.value)}}><option value="" disabled={Boolean(field.required)}>{emptyOption?.label||placeholder}</option>{options.filter(option=>String(option.value)!=='').map(option=><option key={option.value} value={String(option.value)}>{option.label}</option>)}</Select></div>;
}
