import 'chance';

import {TileGenerator} from '../tile-generator';
// We can't import these directly or we'll get circular dependency issues.
import {N, S, Unique, W} from './index';

/// A value that can be converted into an option. An array is converted into a single `Select`.
export type OptionLike = Option | string | number | Array<OptionLike>;

/// The abstract base class of various ways of describing bingo options.
///
/// Option classes are immutable. When it's time to generate squares for a new board, the `build()`
/// method is called to return a mutable generator that can track state over time (for example, to
/// ensure the same option isn't selected more than once).
export abstract class Option {
  /// Converts an `OptionLike` into a full `Option`.
  static wrap(option: OptionLike): Option {
    if (option instanceof Option) return option;
    if (option instanceof Array) return S(...option.map(Option.wrap));
    return new Unique(option.toString());
  }

  /// Returns a generator object given a random number generator.
  abstract build(rng: Chance.Chance): TileGenerator;

  /// Returns a wrapper option that sets the weight of this option. Can take multiple
  /// weights, which are used in order as more items are selected.
  weight(weights: number | number[]): Option {
    return W(weights, this);
  }

  /// Returns a wrapper option that limits this to only having `n` options selected from it.
  only(n: number): Option {
    return N(n, this);
  }
}
