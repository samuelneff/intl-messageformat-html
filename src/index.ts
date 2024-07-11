import {
  createMultiProxy,
  toRecord,
} from 'utikity';
import {
  extractAttributesAndContent,
  formatAttribute,
  identity,
} from './internal.ts';
import {
  elementDefaultAttributes,
  htmlAttributes,
  htmlElements,
  svgAttributes,
  svgElements,
} from './constants.ts';

export type TagFunction = (chunks: string[]) => string;

const htmlElementTagFunctions = createElementTagFunctions(htmlElements);
const htmlAttributeTagFunctions = createAttributeTagFunctions(htmlAttributes);
const svgElementTagFunctions = createElementTagFunctions(svgElements);
const svgAttributTagFunctions = createAttributeTagFunctions(svgAttributes);

export const tagFunctions: Record<string, TagFunction> = {
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

  return createMultiProxy(values, appliedTagFunctions) as unknown as T & Record<string, TagFunction>;
}

function createClassTagFunction(tag: string): TagFunction {
  return function classTagFuction(chunks: string[]) {
    return `<span class="${ tag }">${ chunks.join('') }</span>`;
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

function createAttributeTagFunction(tag: string): TagFunction {
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

function createElementTagFunction(tag: string, defaultAttributes?: Record<string, string>): TagFunction {
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
    return `<${ tag }${ attributes }>${ content }</${ tag }>`;
  };
}

export function createElementTagFunctions(tags: string[]) {
  return toRecord(
    tags,
    identity,
    tag => createElementTagFunction(tag, elementDefaultAttributes[tag])
  );
}
