import {
  createEntityEncodeProxy,
  createMultiProxy,
  MapCache,
  toRecord,
} from 'utikity';
import {
  elementDefaultAttributes,
  htmlAttributes,
  htmlElements,
  svgAttributes,
  svgElements,
} from './constants';
import {
  extractAttributesAndContent,
  formatAttribute,
  identity,
  TagFunction,
  TagFunctions,
} from './internal';

export type { TagFunction } from './internal';

const htmlElementTagFunctions = createElementTagFunctions(htmlElements);
const htmlAttributeTagFunctions = createAttributeTagFunctions(htmlAttributes);
const svgElementTagFunctions = createElementTagFunctions(svgElements);
const svgAttributTagFunctions = createAttributeTagFunctions(svgAttributes);

const classesCache = new MapCache<string[], TagFunctions>();
const wrapCache = new MapCache<object, TagFunctions>();

export const tagFunctions: TagFunctions = {
  // there is some overlap but the implementations are the same so no worries about the overrides
  ...svgElementTagFunctions,
  ...svgAttributTagFunctions,
  ...htmlElementTagFunctions,
  ...htmlAttributeTagFunctions,
};

export function wrapValues<T extends object>(values: T, classNames?: string[], includeDefaults: boolean = true) {
  const cachedTagFunctions = wrapCache.getOrSet(
    values,
    () => (
      classNames
        ? createClassTagFunctions(classNames, includeDefaults)
        : tagFunctions
    )
  );
  return createMultiProxy(
    createEntityEncodeProxy(values),
    cachedTagFunctions
  ) as unknown as T & TagFunctions;
}

function createClassTagFunction(tag: string): TagFunction {
  return function classTagFuction(chunks: string[]) {
    return `<span class="${ tag }">${ chunks.join('') }</span>`;
  };
}

export function createClassTagFunctions(classNames: string[], includeDefaults:boolean = true) {

  return classesCache.getOrSet(classNames, createClassTagFunctionsImpl);

  function createClassTagFunctionsImpl() {
    const classTagFunctions = toRecord(
      classNames,
      identity,
      createClassTagFunction
    );

    if (!includeDefaults) {
      return classTagFunctions;
    }

    return createMultiProxy(
      classTagFunctions,
      tagFunctions
    );
  }
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
    const start = `<${ tag }${ attributes }`;
    const end = content
      ? `>${ content }</${ tag }>`
      : ' />';
    return `${ start }${ end }`;
  };
}

export function createElementTagFunctions(tags: string[]) {
  return toRecord(
    tags,
    identity,
    tag => createElementTagFunction(tag, elementDefaultAttributes[tag])
  );
}

export function clearCaches() {
  classesCache.clear();
  wrapCache.clear();
}
