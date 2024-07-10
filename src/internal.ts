const tagExtractorPattern = /<(\w+)>([^<]+)<\/\1>/g;
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
