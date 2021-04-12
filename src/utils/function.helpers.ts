import { curry as ramdaCurry } from 'ramda';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const EMPTY_ACTION = (): void => { };

export const curry = ramdaCurry;