import {Format} from './format';
import {OnlyN} from './only-n';
import {Option, OptionLike} from './option';
import {Range} from './range';
import {Select} from './select';
import {Weight} from './weight';

export {LimitPerLine} from './limit-per-line';
export {Option, OptionLike} from './option';
export {Unique} from './unique';

export function F(format: string, ...options: OptionLike[]): Format {
  return new Format(format, ...options);
}

export function N(n: number, ...options: OptionLike[]): OnlyN {
  return new OnlyN(n, options);
}

export function O(...options: OptionLike[]): Option {
  return new OnlyN(1, new Select(options));
}

export function R(min: number, max: number): Range {
  return new Range(min, max);
}

export function S(...options: OptionLike[]): Option {
  return new Select(options);
}

export function W(weight: number | number[], option: OptionLike): Option {
  return new Weight(weight, option);
}
