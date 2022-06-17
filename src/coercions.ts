import { object, ZodObject, ZodObjectDef, ZodTypeAny } from 'zod'
import { shapeInfo } from './shapeInfo'

function makeCoercion<T>(
  coercion: (value: FormDataEntryValue) => T,
  emptyValue: unknown,
) {
  return ({
    value,
    optional,
    nullable,
  }: {
    value: FormDataEntryValue | null
    optional: boolean
    nullable: boolean
  }) => {
    if (value) return coercion(value)
    if (nullable) return null
    if (optional) return undefined

    return emptyValue
  }
}

const coerceString = makeCoercion(String, '')
const coerceNumber = makeCoercion(Number, null)
const coerceBoolean = makeCoercion(Boolean, false)

const coerceDate = makeCoercion((value) => {
  if (typeof value !== 'string') return null

  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}, null)

function coerceValue(value: FormDataEntryValue | null, shape?: ZodTypeAny) {
  const { typeName, optional, nullable } = shapeInfo(shape)

  if (typeName === 'ZodBoolean') {
    return coerceBoolean({ value, optional, nullable })
  }

  if (typeName === 'ZodNumber') {
    return coerceNumber({ value, optional, nullable })
  }

  if (typeName === 'ZodDate') {
    return coerceDate({ value, optional, nullable })
  }

  if (
    typeName === 'ZodString' ||
    typeName === 'ZodEnum' ||
    typeName === 'ZodNativeEnum'
  ) {
    return coerceString({ value, optional, nullable })
  }

  return value
}

export { coerceValue }
