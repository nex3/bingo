import 'chance';

import {Option, OptionLike} from './option';
import {Tile} from '../tile';
import {TileGenerator} from '../tile-generator';

/// An option that makes a weighted seletion from among an array of other options.
export class Select extends Option {
  private readonly items: Option[];

  constructor(items: Array<OptionLike>) {
    super();
    this.items = items.map(Option.wrap);
  }

  build(rng: Chance.Chance): TileGenerator {
    return new (class {
      /// The inner generator from which to choose.
      private readonly generators: TileGenerator[];

      constructor(private readonly option: Select) {
        this.generators = option.items.map(item => item.build(rng));
      }

      select(): Tile | null {
        while (this.generators.length > 0) {
          const i = rng.weighted(
            [...this.generators.keys()],
            this.generators.map(generator => generator.weight ?? 100)
          );
          const result = this.generators[i].select();
          if (result) return result;

          // The inner generator is out of tiles, so remove it from the list.
          this.generators.splice(i, 1);
        }
        return null;
      }

      toString(): string {
        return this.toString();
      }
    })(this);
  }

  toString() {
    return `S([${this.items}])`;
  }
}
