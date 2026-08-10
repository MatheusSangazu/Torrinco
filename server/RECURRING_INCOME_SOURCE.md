# Fonte de renda em recorrências

Antes desta correção, `transactions` possuía `income_source_id`, mas `recurring_transactions` não. O frontend enviava o campo, o schema o removia e as ocorrências futuras perdiam a fonte de renda. Preservar esse vínculo exige persistência no template; por isso a migration `20260809006000_recurring_integrity` é necessária.

A mesma migration adiciona `creation_key`, uma chave opcional e única gerada pelo cliente por tentativa lógica de criação. Retries com a mesma chave retornam a recorrência existente e não materializam uma segunda ocorrência.
