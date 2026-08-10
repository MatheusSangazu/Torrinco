import { api } from './api';
export type ImportItem={id:number;row_index:number;included:boolean;transaction_date:string;original_description:string;description:string;original_excerpt?:string;amount:number|string;type:'expense'|'income';category_id?:number|null;entity_id?:number|null;payment_method?:string;transaction_status:'paid'|'pending';item_kind:string;confidence:number|string;requires_review:boolean;duplicate_kind?:string;duplicate_reason?:string;exclusion_reason?:string};
export type FinancialImport={id:number;file_name:string;file_size:number;document_type:string;status:string;warning_message?:string;target_entity_id?:number|null;target_entity?:{id:number;name:string;type:string};created_at:string;items:ImportItem[];reconciliation:{found:number;selected:number;ignored:number;duplicates:number;feesAndInterest:number;expenseTotal:number;incomeTotal:number;selectedTotal:number;documentTotal:number|null;difference:number|null}};
export const importsService={
 list:async()=> (await api.get('/imports')).data.imports,
 get:async(id:number):Promise<FinancialImport>=> (await api.get(`/imports/${id}`)).data,
 upload:async(file:File,onProgress:(n:number)=>void):Promise<FinancialImport>=>{const body=new FormData();body.append('file',file);return(await api.post('/imports',body,{onUploadProgress:e=>onProgress(e.total?Math.round(e.loaded/e.total*100):0)})).data},
 update:async(id:number,data:object):Promise<FinancialImport>=>(await api.patch(`/imports/${id}`,data)).data,
 item:async(id:number,itemId:number,data:object):Promise<FinancialImport>=>(await api.patch(`/imports/${id}/items/${itemId}`,data)).data,
 add:async(id:number,data:object):Promise<FinancialImport>=>(await api.post(`/imports/${id}/items`,data)).data,
 confirm:async(id:number,data:object)=>(await api.post(`/imports/${id}/confirm`,data)).data,
 cancel:async(id:number)=>(await api.post(`/imports/${id}/cancel`)).data
};
