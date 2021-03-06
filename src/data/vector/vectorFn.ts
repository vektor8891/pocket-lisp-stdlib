import { PLNumber } from '../number/PLNumber'
import { assetNothing, typeCheck } from '../../utils/assert'
import { plNumber } from '../number/numberFn'
import { add, multiple } from '../../typeClasses'
import { PLString } from '../string/PLString'
import { plString } from '../string/stringFn'
import { PLBase } from '../PLBase'
import { PLVector } from './PLVector'
import { StrictArray } from '../types'

export function plVector<T extends PLBase>(...value: StrictArray<T>): PLVector<T> {
  return new PLVector<T>(value)
}

export const sum: (list: PLVector<PLNumber>) => PLNumber = (list) => {
  typeCheck(PLVector, list)
  return list.reduce(plNumber(0), add)
}

export const prod: (list: PLVector<PLNumber>) => PLNumber = (list) => {
  typeCheck(PLVector, list)
  return list.reduce(plNumber(1), multiple)
}

export const intersperse: <T extends PLBase>(separator: T, list: PLVector<T>) => PLVector<T> = (separator, list) => {
  typeCheck(PLVector, list)
  return list.intersperse(separator)
}

export const join: (list: PLVector<PLString>) => PLString = (list) => {
  typeCheck(PLVector, list)
  return list.reduce(plString(''), add)
}

export const joinWith: (separator: PLString, list: PLVector<PLString>) => PLString = (separator, list) => {
  typeCheck(PLVector, list)
  return list.intersperse(separator).reduce(plString(''), add)
}

export const numList: (separator: PLString, list: PLVector<PLNumber>) => PLString = (separator, list) => {
  typeCheck(PLVector, list)
  return list.map(x => plString(x.toString())).intersperse(separator).reduce(plString(''), add)
}

export const head: <T extends PLBase>(list: PLVector<T>) => T = (list) => {
  typeCheck(PLVector, list)
  return assetNothing(list.value[0], 'Vector is empty')
}

export const tail: <T extends PLBase>(list: PLVector<T>) => PLVector<T> = (list) => {
  typeCheck(PLVector, list)
  assetNothing(list.value.length, 'Vector is not defined correctly')
  return plVector(...(list.value.slice(1) as StrictArray<any>))
}

export const reverse: <T extends PLBase>(list: PLVector<T>) => PLVector<T> = (list) => {
  typeCheck(PLVector, list)
  return plVector(...(list.value.reverse() as StrictArray<any>))
}

export const slice: <T extends PLBase>(list: PLVector<T>, start: PLNumber, end: PLNumber) => PLVector<T> = (
  list,
  start,
  end,
) => {
  typeCheck(PLVector, list)
  typeCheck(PLNumber, end)
  typeCheck(PLNumber, start)
  assetNothing(list.value.length, 'Vector is not defined correctly')
  return plVector(...(list.value.slice(start.value, end.value) as StrictArray<any>))
}

export default {
  sum,
  prod,
  intersperse,
  join,
  'join-with': joinWith,
  'num-list': numList,
  head,
  reverse,
  slice,
  tail,
}
