import { Combobox, type ComboboxOption, type ComboboxProps } from './Combobox';

export type Option=ComboboxOption;
export type CustomSelectProps=ComboboxProps;

export function CustomSelect(props:CustomSelectProps){
  return <Combobox {...props}/>;
}
