import { Measureable } from '~/devices/measureable';
import { Nameable } from '~/nameable';
import { Pollable } from '~/pollable';

export interface Device extends Measureable, Nameable, Pollable {
  name: string;
}
