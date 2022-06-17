import { inputFromForm } from 'remix-domains'
import { SomeZodObject, z } from 'zod'
import { coerceValue } from './coercions'
import { FormValues } from './formAction.server'

export default async function getFormValues<Schema extends SomeZodObject>(
  request: Request,
  schema: Schema,
): Promise<FormValues<z.infer<Schema>>> {
  const input = await inputFromForm(request)
  return coerceValue(input, schema) as FormValues<z.infer<Schema>>
}
