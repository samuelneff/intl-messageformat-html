import { extractEmbeddedTags } from './internal.js';

export enum TagFunctionStyle {
  elements = 'elements',
  classes = 'classes',
}

export interface TagFunctionOptions {
  classNamePrefix?: string;
  customClassNames?: string[];
  linksTarget?: string;

}

export const specialTagFunctions = {
  a(chunks: string[]) {
    const text = chunks.join('');

  }
}

export function createTagFunction(tag: string) {
  return function tagFunction(chunks: string[]) {
    const { text, ...attributes } = extractEmbeddedTags(chunks.join(''));


  }
}
// export const defaultTagFunctions = createTagFunctions