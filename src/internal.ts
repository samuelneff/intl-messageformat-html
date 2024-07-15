
export type TagFunction = (chunks: string[]) => string;
export type TagFunctions = Record<string, TagFunction>;

export interface ExtractedAttributes {
  attributes: string;
  content: string;
}

const attributeExtractPattern = /((?: [\w-]+="[^"]+")+)(.+)/
const tagExtractorPattern = /<([\w-]+)>([^<]+)<\/\1>/g;
const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
};
const entitiesPattern = new RegExp(`[${ Object.keys(entityMap).join('') }]`, 'g');

export function entityEncode(text: string) {
  return text?.replace(entitiesPattern, entityEncodeChar) ?? '';

  function entityEncodeChar(entity: string) {
    return entityMap[ entity as keyof typeof entityMap ];
  }
}

/**
 * Extracts the attributes portion of inner content and the inner text portion.
 */
export function extractAttributesAndContent(content: string): ExtractedAttributes {
  const match = attributeExtractPattern.exec(content);
  if (!match) {
    return {
      attributes: '',
      content
    };
  }

  return {
    attributes: match[ 1 ],
    content: match[ 2 ],
  };
}

/**
 * Given a string with embedded tags, returns an object with the
 * named tags and their values and a `text` property with the remaining text.
 */
export function extractEmbeddedTags(text: string) {
  const result: Record<string, string> = {};
  result.text = text.replace(tagExtractorPattern, extractEmbeddedTag);
  return result;

  function extractEmbeddedTag(_match: string, tag: string, content: string) {
    result[ tag ] = content;
    return '';
  }
}

/**
 * Returns the passed in value
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Formats an attriute and entity-encodes the value
 */
export function formatAttribute(name: string, value: string) {
  return ` ${ name }="${ entityEncode(value) }"`;
}
