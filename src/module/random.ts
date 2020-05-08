import { toInt } from '../utils/convert'
import { plNumber, PLNumber } from '../data/PLNumber'
import { plVector, PLVector } from '../data/PLVector'

const rand = Math.random

/**
 * Return the next random floating point number in the range [0.0, 1.0).
 */
export const random = () => plNumber(rand())

/**
 * Return a random integer N such that a <= N <= b.
 */
export const randomInt = (a: PLNumber, b: PLNumber) => {
  const ai = toInt(a.value)
  const bi = toInt(b.value)
  return plNumber(toInt(ai + rand() * (bi - ai)))
}

/**
 * Shuffle vector
 */
export const shuffle = (v: PLVector<any>) => {
  const vv = [...v.value]
  // based on: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  let j, x, i
  for (i = vv.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = vv[i]
    vv[i] = vv[j]
    vv[j] = x
  }
  return plVector(...vv)
}
