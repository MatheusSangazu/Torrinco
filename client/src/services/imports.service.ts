import { api } from './api';
export type DuplicateEvidence={kind:string;destination_id?:number|null;date?:string;description?:string;amount?:number;transaction_id?:number;import_id?:number;source_item_id?:number};
export type ImportItem={id:number;row_index:number;included:boolean;transaction_date:string;original_description:string;description:string;original_excerpt?:string;amount:number|string;type:'expense'|'income';category_id?:number|null;entity_id?:number|null;payment_method?:string;transaction_status:'paid'|'pending';item_kind:string;confidence:number|string;requires_review:boolean;duplicate_kind?:string|null;duplicate_reason?:string|null;duplicate_evidence?:DuplicateEvidence;exclusion_reason?:string|null};
export type PreviousImport={id:number;completed_at?:string|null;target_entity_id?:number|null;target_entity?:{id:number;name:string;type:string}|null};
export type FinancialImport={id:number;file_name:string;file_size:number;document_type:string;status:string;warning_message?:string|null;resumed?:boolean;due_date?:string|null;closing_date?:string|null;target_entity_id?:number|null;target_entity?:{id:number;name:string;type:string};created_at:string;items:ImportItem[];reconciliation:{found:number;selected:number;ignored:number;duplicates:number;feesAndInterest:number;expenseTotal:number;incomeTotal:number;selectedTotal:number;documentTotal:number|null;difference:number|null}};
export type UploadResult=FinancialImport|{reimport_blocked:true;previous_import:PreviousImport};
export type ImportHistoryPage={imports:Array<Omit<FinancialImport,'items'|'reconciliation'>&{_count?:{items:number}}> ;next_cursor:number|null;has_more:boolean};
export type ImportHistoryFilters={cursor?:number;limit?:number;search?:string;status?:string;from?:string;to?:string};
export const importsService={
 list:async(params:ImportHistoryFilters={}):Promise<ImportHistoryPage>=> (await api.get('/imports',{params})).data,
 get:async(id:number):Promise<FinancialImport>=> (await api.get(`/imports/${id}`)).data,
 upload:async(file:File,onProgress:(n:number)=>void,allowReimport=false):Promise<UploadResult>=>{const body=new FormData();body.append('file',file);if(allowReimport)body.append('allow_reimport','true');return(await api.post('/imports',body,{onUploadProgress:e=>onProgress(e.total?Math.round(e.loaded/e.total*100):0)})).data},
 update:async(id:number,data:object):Promise<FinancialImport>=>(await api.patch(`/imports/${id}`,data)).data,
 item:async(id:number,itemId:number,data:object,signal?:AbortSignal):Promise<FinancialImport>=>(await api.patch(`/imports/${id}/items/${itemId}`,data,{signal})).data,
 bulkItems:async(id:number,itemIds:number[],changes:object):Promise<FinancialImport>=>(await api.patch(`/imports/${id}/items/bulk`,{item_ids:itemIds,changes})).data,
 add:async(id:number,data:object):Promise<FinancialImport>=>(await api.post(`/imports/${id}/items`,data)).data,
 confirm:async(id:number,data:object)=>(await api.post(`/imports/${id}/confirm`,data)).data,
 cancel:async(id:number)=>(await api.post(`/imports/${id}/cancel`)).data
};
