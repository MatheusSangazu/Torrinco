interface ApiErrorDetail { message?:unknown }
interface ApiErrorPayload { error?:unknown; details?:ApiErrorDetail[] }

export function getApiErrorMessage(error:unknown,fallback='Não foi possível concluir a operação. Tente novamente.'){
  const payload=(error as {response?:{data?:ApiErrorPayload}})?.response?.data;
  const detail=Array.isArray(payload?.details)?payload.details.find(item=>typeof item?.message==='string'&&item.message.trim()):undefined;
  if(typeof detail?.message==='string')return detail.message;
  if(typeof payload?.error==='string'&&payload.error.trim())return payload.error;
  return fallback;
}
