// This is a hack so we can use an alias to this directory when using path.resolve
// where we can't use alias like we do on regular imports.
// You can import this file and its export is the dirname of this
// directory
// Original idea stolen from here:
// https://github.com/ilearnio/module-alias/issues/71#issuecomment-534409889
import {join} from 'path';
export const dirname: string = __dirname;
export const packagesDir: string = join(__dirname, '../..');
