import { ZodTypeAny } from 'zod'

type ZodTypeName =
  | 'ZodString'
  | 'ZodNumber'
  | 'ZodBoolean'
  | 'ZodDate'
  | 'ZodEnum'
  | 'ZodObject'
  | 'ZodNativeEnum'

type ShapeInfo = {
  typeName: ZodTypeName | null
  optional: boolean
  nullable: boolean
  getDefaultValue?: () => unknown
  enumValues?: string[]
}

function shapeInfo(
  shape?: ZodTypeAny,
  optional = false,
  nullable = false,
  getDefaultValue?: ShapeInfo['getDefaultValue'],
  enumValues?: ShapeInfo['enumValues'],
): ShapeInfo {
  if (!shape) {
    return { typeName: null, optional, nullable, getDefaultValue, enumValues }
  }

  const typeName = shape._def.typeName

  if (typeName === 'ZodEffects') {
    return shapeInfo(
      shape._def.schema,
      optional,
      nullable,
      getDefaultValue,
      enumValues,
    )
  }

  if (typeName === 'ZodOptional') {
    return shapeInfo(
      shape._def.innerType,
      true,
      nullable,
      getDefaultValue,
      enumValues,
    )
  }

  if (typeName === 'ZodNullable') {
    return shapeInfo(
      shape._def.innerType,
      optional,
      true,
      getDefaultValue,
      enumValues,
    )
  }

  if (typeName === 'ZodDefault') {
    return shapeInfo(
      shape._def.innerType,
      optional,
      nullable,
      shape._def.defaultValue,
      enumValues,
    )
  }

  if (typeName === 'ZodEnum') {
    return {
      typeName,
      optional,
      nullable,
      getDefaultValue,
      enumValues: shape._def.values,
    }
  }

  if (typeName === 'ZodNativeEnum') {
    return {
      typeName,
      optional,
      nullable,
      getDefaultValue,
      enumValues: Object.keys(shape._def.values),
    }
  }

  return { typeName, optional, nullable, getDefaultValue, enumValues }
}

export { shapeInfo }
export type { ZodTypeName, ShapeInfo }
