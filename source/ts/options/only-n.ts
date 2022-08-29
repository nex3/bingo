import 'chance';

import {Option, OptionLike} from './option';
import {Tile} from '../tile';
import {TileGenerator} from '../tile-generator';

/// A wrapper option that limits the inner option to only returning up to `n` tiles.
///
/// This returns a generator with the same weight as the inner option.
export class OnlyN extends Option {
  /// The wrapped option.
  private readonly option: Option;

  constructor(private readonly n: number, option: OptionLike) {
    super();
    this.option = Option.wrap(option);
  }

  build(rng: Chance.Chance): TileGenerator {
    return new (class {
      /// The inner generator.
      private readonly generator: TileGenerator;

      /// The number of times remaining that this generator may be invoked.
      private n: number;

      constructor(private readonly option: OnlyN) {
        this.generator = option.option.build(rng);
        this.n = option.n;
      }

      get weight(): number | undefined {
        return this.generator.weight;
      }

      select(): Tile | null {
        if (this.n === 0) return null;
        this.n--;
        return this.generator.select();
      }

      toString() {
        return this.option.toString();
      }
    })(this);
  }

  toString() {
    return `N(${this.n}, ${this.option})`;
  }
}
