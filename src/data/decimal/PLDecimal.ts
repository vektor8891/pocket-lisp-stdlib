import { expandDecimals, getDecimalString, createSimplifiedDecimal, parseNumString } from './decimalFn'
import { PLBool } from '../bool/PLBool'
import { plBool } from '../bool/boolFn'
import { PLBase } from '../PLBase'
import { PLString } from '../string/PLString'
import { plString } from '../string/stringFn'
import { RuntimeError } from 'pocket-lisp'
import { Subtract } from '../../typeClasses/ops'
import { Copy } from '../../typeClasses/baseType'
import { Ordering, PartialEq, PartialOrd } from '../../typeClasses/cmpType'
import { Add, Divide, Multiple, Negate } from '../../typeClasses/opsType'

const MAXDECIMALS = 12

export class PLDecimal
  implements
    PLBase,
    PartialEq<PLDecimal>,
    Add<PLDecimal>,
    Subtract<PLDecimal>,
    Multiple<PLDecimal>,
    Divide<PLDecimal>,
    Negate<PLDecimal>,
    PartialOrd<PLDecimal>,
    Copy<PLDecimal> {
  public static kind = 'Decimal'

  private readonly _strValue: string
  private readonly _intValue: number
  private readonly _decimals: number

  public constructor(strValue: string) {
    const decObj = parseNumString(strValue)
    this._decimals = decObj.decimals
    this._intValue = decObj.intValue
    this._strValue = strValue
  }

  public get strValue(): string {
    return this._strValue
  }

  public get intValue(): number {
    return this._intValue
  }

  public get decimals(): number {
    return this._decimals
  }

  public equals(d: PLDecimal): PLBool {
    const decimalObj = expandDecimals(this, d)
    return plBool(decimalObj.intValue1 === decimalObj.intValue2)
  }

  public negate(): PLDecimal {
    const resultString = getDecimalString(-this.intValue, this.decimals)
    return new PLDecimal(resultString)
  }

  public add(d: PLDecimal): PLDecimal {
    const decimalObj = expandDecimals(this, d)
    const totalIntValue = decimalObj.intValue1 + decimalObj.intValue2
    return createSimplifiedDecimal(totalIntValue, decimalObj.maxDecimal)
  }

  public subtract(d: PLDecimal): PLDecimal {
    const decimalObj = expandDecimals(this, d)
    const totalIntValue = decimalObj.intValue1 - decimalObj.intValue2
    return createSimplifiedDecimal(totalIntValue, decimalObj.maxDecimal)
  }

  public multiple(d: PLDecimal): PLDecimal {
    return createSimplifiedDecimal(this.intValue * d.intValue, this.decimals + d.decimals)
  }

  public divide(d: PLDecimal): PLDecimal {
    if (d.intValue === 0) {
      throw new RuntimeError('Cannot divide by zero!')
    }
    const decimalObj = expandDecimals(this, d)
    const divideIntValue = Math.round((decimalObj.intValue1 / decimalObj.intValue2) * Math.pow(10, MAXDECIMALS))
    return createSimplifiedDecimal(divideIntValue, MAXDECIMALS)
  }

  public partialCmp(other: PLDecimal): Ordering {
    const decimalObj = expandDecimals(this, other)

    if (decimalObj.intValue1 < decimalObj.intValue2) return Ordering.Less
    if (decimalObj.intValue1 > decimalObj.intValue2) return Ordering.Greater
    return Ordering.Equal
  }

  public toJS(): { intValue: number; decimals: number } {
    return {
      intValue: this._intValue,
      decimals: this._decimals,
    }
  }

  public toString(): string {
    return `${this._strValue}`
  }

  public copy(): PLDecimal {
    return new PLDecimal(this._strValue)
  }

  public debugTypeOf(): PLString {
    return plString(PLDecimal.kind)
  }
}