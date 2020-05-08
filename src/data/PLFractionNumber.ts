import { gcd } from '../utils/math'
import {
  add,
  BaseNumberOp,
  divide,
  equals,
  multiple,
  negate,
  of,
  SerializeToJS,
  Setoid,
  subtract,
  toJS
} from '../types'
import { RuntimeError } from 'pocket-lisp'
import { plBool } from './PLBool'
import { typeCheck } from '../utils/assert'

interface JSFractionNumber {
  numerator: number
  denominator: number
}

///

export class PLFractionNumber
  implements
    SerializeToJS<JSFractionNumber>,
    Setoid<PLFractionNumber>,
    BaseNumberOp<PLFractionNumber> {
  private readonly _n: number
  private readonly _d: number

  public static [of](value: JSFractionNumber) {
    return plFractionNumber(value.numerator, value.denominator)
  }

  public constructor(numerator: number, denominator: number) {
    if (!isValid(numerator, denominator)) {
      throw new Error('Invalid fraction number parameters!')
    }

    if (denominator < 0) {
      numerator *= -1
      denominator *= -1
    }

    const divisor = gcd(Math.abs(numerator), Math.abs(denominator))
    this._n = numerator / divisor
    this._d = denominator / divisor
  }

  public get numerator() {
    return this._n
  }

  public get denominator() {
    return this._d
  }

  public [equals](a: PLFractionNumber) {
    return plBool(this.numerator === a.numerator && this.denominator === a.denominator)
  }

  public [negate]() {
    return new PLFractionNumber(-this._n, this._d)
  }

  public [add](a: PLFractionNumber) {
    const numerator = this.numerator * a.denominator + this.denominator * a.numerator
    const denominator = this.denominator * a.denominator
    return new PLFractionNumber(numerator, denominator)
  }

  public [subtract](a: PLFractionNumber) {
    const numerator = this.numerator * a.denominator - this.denominator * a.numerator
    const denominator = this.denominator * a.denominator
    return new PLFractionNumber(numerator, denominator)
  }

  public [multiple](a: PLFractionNumber) {
    const numerator = this.numerator * a.numerator
    const denominator = this.denominator * a.denominator
    return new PLFractionNumber(numerator, denominator)
  }

  public [divide](a: PLFractionNumber) {
    const numerator = this.numerator * a.denominator
    const denominator = this.denominator * a.numerator
    return new PLFractionNumber(numerator, denominator)
  }

  public [toJS]() {
    return {
      numerator: this._n,
      denominator: this._d
    }
  }

  public toString() {
    return `${this._n}/${this._d}`
  }
}

///

const isValid = (n: number, d: number) => {
  return Number.isInteger(n) && Number.isInteger(d) && d !== 0
}

///

export const plFractionNumber = (n: number, d: number): PLFractionNumber => {
  return new PLFractionNumber(n, d)
}

export const str2plFractionNumber = (str: string) => {
  const [n, d] = str.split('/').map(parseFloat)
  if (isValid(n, d)) {
    return new PLFractionNumber(n, d)
  } else {
    throw new RuntimeError(`Invalid fraction number: ${str}.`)
  }
}

export const reciprocal = (fn: PLFractionNumber): PLFractionNumber => {
  typeCheck(PLFractionNumber, fn)
  return plFractionNumber(fn.denominator, fn.numerator)
}
