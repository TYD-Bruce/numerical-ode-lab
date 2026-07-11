import {
  MATH_CONSTANT_NAMES,
  MATH_FUNCTION_NAMES,
  MATH_VARIABLE_NAMES,
  type MathAst,
  type MathVariableName,
  type MathVariableProfile,
} from "./ast";
import { MathExpressionError, variableValidationError } from "./errors";

const CONSTANT_NAMES = new Set<string>(MATH_CONSTANT_NAMES);
const FUNCTION_NAMES = new Set<string>(MATH_FUNCTION_NAMES);
const VARIABLE_NAMES = new Set<string>(MATH_VARIABLE_NAMES);

const PROFILE_VARIABLES: Readonly<
  Record<MathVariableProfile, ReadonlySet<MathVariableName>>
> = {
  rhs: new Set(["t", "y"]),
  exact_solution: new Set(["t", "t0", "y0"]),
  second_order_rhs: new Set(["t", "u"]),
};

type UnknownRecord = Record<PropertyKey, unknown>;

function invalidAst(message: string): never {
  throw new MathExpressionError("invalid_ast", message);
}

function requireRecord(value: unknown): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return invalidAst("The mathematical expression contains an invalid AST node.");
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return invalidAst("Mathematical AST nodes must be plain objects.");
  }

  return value as UnknownRecord;
}

function requireShape(record: UnknownRecord, expected: readonly string[]): void {
  const enumerableKeys = Reflect.ownKeys(record).filter((key) =>
    Object.prototype.propertyIsEnumerable.call(record, key)
  );
  if (
    enumerableKeys.length !== expected.length ||
    enumerableKeys.some((key) => typeof key !== "string" || !expected.includes(key))
  ) {
    invalidAst("The mathematical expression contains unexpected AST fields.");
  }

  for (const key of expected) {
    const descriptor = Object.getOwnPropertyDescriptor(record, key);
    if (!descriptor || !("value" in descriptor)) {
      invalidAst("Mathematical AST fields must be plain data values.");
    }
  }
}

function dataValue(record: UnknownRecord, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(record, key);
  if (!descriptor || !("value" in descriptor)) {
    return invalidAst("Mathematical AST fields must be plain data values.");
  }
  return descriptor.value;
}

function validateVariable(name: unknown, profile?: MathVariableProfile): void {
  if (typeof name !== "string") {
    invalidAst("A mathematical variable name must be a string.");
  }

  const known = VARIABLE_NAMES.has(name);
  if (!known) throw variableValidationError(name, profile, false);

  if (profile && !PROFILE_VARIABLES[profile].has(name as MathVariableName)) {
    throw variableValidationError(name, profile, true);
  }
}

function validateNode(
  value: unknown,
  profile: MathVariableProfile | undefined,
  active: WeakSet<object>
): void {
  const record = requireRecord(value);
  if (active.has(record)) {
    invalidAst("The mathematical expression contains a cyclic AST reference.");
  }
  active.add(record);

  try {
    const kind = dataValue(record, "kind");
    if (typeof kind !== "string") invalidAst("A mathematical AST node is missing its kind.");

    switch (kind) {
      case "number": {
        requireShape(record, ["kind", "value"]);
        const numberValue = dataValue(record, "value");
        if (typeof numberValue !== "number" || !Number.isFinite(numberValue)) {
          throw new MathExpressionError(
            "invalid_number",
            "Numeric literals must be finite JavaScript numbers."
          );
        }
        return;
      }
      case "constant": {
        requireShape(record, ["kind", "name"]);
        const name = dataValue(record, "name");
        if (typeof name !== "string" || !CONSTANT_NAMES.has(name)) {
          throw new MathExpressionError(
            "unsupported_constant",
            `Unsupported mathematical constant ${String(name)}.`
          );
        }
        return;
      }
      case "variable":
        requireShape(record, ["kind", "name"]);
        validateVariable(dataValue(record, "name"), profile);
        return;
      case "negate":
        requireShape(record, ["kind", "operand"]);
        validateNode(dataValue(record, "operand"), profile, active);
        return;
      case "add": {
        requireShape(record, ["kind", "terms"]);
        const terms = dataValue(record, "terms");
        if (!Array.isArray(terms)) invalidAst("Addition terms must be an array.");
        if (terms.length === 0) {
          throw new MathExpressionError(
            "empty_addition",
            "An addition must contain at least one term."
          );
        }
        for (const term of terms) validateNode(term, profile, active);
        return;
      }
      case "multiply": {
        requireShape(record, ["kind", "factors"]);
        const factors = dataValue(record, "factors");
        if (!Array.isArray(factors)) invalidAst("Multiplication factors must be an array.");
        if (factors.length === 0) {
          throw new MathExpressionError(
            "empty_multiplication",
            "A multiplication must contain at least one factor."
          );
        }
        for (const factor of factors) validateNode(factor, profile, active);
        return;
      }
      case "divide":
        requireShape(record, ["kind", "numerator", "denominator"]);
        validateNode(dataValue(record, "numerator"), profile, active);
        validateNode(dataValue(record, "denominator"), profile, active);
        return;
      case "power":
        requireShape(record, ["kind", "base", "exponent"]);
        validateNode(dataValue(record, "base"), profile, active);
        validateNode(dataValue(record, "exponent"), profile, active);
        return;
      case "function": {
        requireShape(record, ["kind", "name", "argument"]);
        const name = dataValue(record, "name");
        if (typeof name !== "string" || !FUNCTION_NAMES.has(name)) {
          throw new MathExpressionError(
            "unsupported_function",
            `Unsupported mathematical function ${String(name)}.`
          );
        }
        validateNode(dataValue(record, "argument"), profile, active);
        return;
      }
      default:
        invalidAst(`Unsupported mathematical AST node kind ${kind}.`);
    }
  } finally {
    active.delete(record);
  }
}

export function validateMathAst(
  value: unknown,
  profile?: MathVariableProfile
): asserts value is MathAst {
  validateNode(value, profile, new WeakSet<object>());
}

export function isMathAst(value: unknown, profile?: MathVariableProfile): value is MathAst {
  try {
    validateMathAst(value, profile);
    return true;
  } catch {
    return false;
  }
}

export function allowedVariablesForProfile(
  profile: MathVariableProfile
): ReadonlySet<MathVariableName> {
  return new Set(PROFILE_VARIABLES[profile]);
}
