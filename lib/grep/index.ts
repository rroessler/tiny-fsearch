/// FSearch Imports
import { POSIX } from './posix';
import { Win32 } from './win32';
import { Abstract } from './abstract';

/** Grep Shell Class. */
export type Grep = Abstract;
export const Grep = process.platform === 'win32' ? Win32 : POSIX;
