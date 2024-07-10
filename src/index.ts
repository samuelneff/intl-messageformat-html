import { createMultiProxy, toRecord } from 'utikity';
import {
  entityEncode,
  extractAttributesAndContent,
  formatAttribute,
  identity,
} from './internal.js';
import {
  elementDefaultAttributes,
  htmlAttributes,
  htmlElements,
  svgAttributes,
  svgElements,
} from './constants.js';

const htmlElementTagFunctions = createElementTagFunctions(htmlElements);
const htmlAttributeTagFunctions = createAttributeTagFunctions(htmlAttributes);
const svgElementTagFunctions = createElementTagFunctions(svgElements);
const svgAttributTagFunctions = createAttributeTagFunctions(svgAttributes);

export const tagFunctions = {
  // there is some overlap but the implementations are the same so no worries about the overrides
  ...svgElementTagFunctions,
  ...svgAttributTagFunctions,
  ...htmlElementTagFunctions,
  ...htmlAttributeTagFunctions,
};

export function wrapValues<T extends object>(values: T, classNames?: string[], includeDefaults: boolean = true) {
  const appliedTagFunctions = classNames
    ? createClassTagFunctions(classNames, includeDefaults)
    : tagFunctions;

  return createMultiProxy(values, appliedTagFunctions) as unknown as T;
}

function createClassTagFunction(tag: string) {
  return function classTagFuction(chunks: string[]) {
    return `<span class="${ tag }">${ entityEncode(chunks.join('')) }</span>`;
  };
}

export function createClassTagFunctions(classNames: string[], includeDefaults:boolean = true) {
  const classTagFunctions = toRecord(
    classNames,
    identity,
    createClassTagFunction
  );

  if (!includeDefaults) {
    return classTagFunctions;
  }

  return {
    ...classTagFunctions,
    ...tagFunctions,
  };
}

function createAttributeTagFunction(tag: string) {
  return function attributeTagFunction(chunks: string[]) {
    return formatAttribute(tag, chunks.join(''));
  };
}

export function createAttributeTagFunctions(tags: string[]) {
  return toRecord(
    tags,
    identity,
    createAttributeTagFunction,
  );
}

function createElementTagFunction(tag: string, defaultAttributes?: Record<string, string>) {
  return function elementTagFunction(chunks: string[]) {
    let {attributes, content} = extractAttributesAndContent(chunks.join(''));

    if (defaultAttributes) {
      Object.entries(defaultAttributes).forEach(
        ([ name, value ]) => {
          if (attributes.includes(` ${ name }="`)) {
            return;
          }
          attributes += formatAttribute(name, value);
        }
      );
    }
    return `<${ tag }${ attributes }>${ entityEncode(content) }</${ tag }`;
  };
}

export function createElementTagFunctions(tags: string[]) {
  return toRecord(
    tags,
    identity,
    tag => createElementTagFunction(tag, elementDefaultAttributes[tag])
  );
}
