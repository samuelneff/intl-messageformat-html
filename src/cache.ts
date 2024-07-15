import { TagFunctions } from './internal.js';

interface CachedFunctions {
  lastUsed: number; // From Date.now()
  usedCount: number;
  tagFunctions: TagFunctions;
}

let cacheSize = 100;
const wrapCache = new Map<object, CachedFunctions>();
const classesCache = new Map<string[], CachedFunctions>();
const pendingTimeouts = [] as NodeJS.Timeout[];

export function setTagFunctionCacheSize(newCacheSize: number) {
  cacheSize = newCacheSize;
  maybeScheduleCacheReduction(wrapCache);
  maybeScheduleCacheReduction(classesCache);
}

export function getOrPutWrapCache<T extends object>(values: T, creator: () => TagFunctions) {
  return getOrPutCache(
    values,
    wrapCache,
    creator
  );
}

export function getOrPutClassesCache(classes: string[], creator: () => TagFunctions) {
  return getOrPutCache(
    classes,
    classesCache,
    creator
  );
}

function getOrPutCache<T>(key: T, cache: Map<T, CachedFunctions>, creator: () => TagFunctions) {

  if (cacheSize === 0) {
    return creator();
  }

  const cachedFunctions = cache.get(key);
  if (cachedFunctions) {
    cachedFunctions.usedCount++;
    cachedFunctions.lastUsed = Date.now();
    return cachedFunctions.tagFunctions;
  }

  const tagFunctions = creator();

  cache.set(
    key,
    {
      usedCount: 1,
      lastUsed: Date.now(),
      tagFunctions,
    },
  );

  maybeScheduleCacheReduction(cache);

  return tagFunctions;
}

export function maybeScheduleCacheReduction<T>(cache: Map<T, CachedFunctions>) {
  if (cache.size <= cacheSize) {
    return;
  }

  pendingTimeouts.push(setTimeout(() => reduceCache(cache)));
}

/**
 * Exported for unit tests only
 */
export function reduceCache<T>(cache: Map<T, CachedFunctions>) {

  clearTimeouts();

  if (cacheSize === 0) {
    cache.clear();
    return;
  }

  if (cache.size <= cacheSize) { // can happen if a reduction is scheduled and then cache size changes
    return;
  }

  const entries = [ ...cache.entries() ]
    .filter(
      ([_, cachedFunctions]) => cachedFunctions.usedCount > 1
  );

  if (entries.length > cacheSize) {
    entries.sort(
      ([ , x ], [ , y ]) => y.lastUsed - x.lastUsed
    );
    entries.length = Math.floor(cacheSize * 0.6);
  }

  cache.clear()
  entries.forEach(
    ([ key, cacheFunctions ]) => {
      cache.set(key, cacheFunctions);
    }
  );
}

function clearTimeouts() {
  pendingTimeouts.forEach(
    timeout => clearTimeout(timeout)
  );
  pendingTimeouts.length = 0;
}

/**
 * For unit tests only
 */
export function clearBothCaches() {
  clearTimeouts();
  wrapCache.clear();
  classesCache.clear();
}

/**
 * For unit tests only
 */
export function wrapCacheSize() {
  return wrapCache.size;
}

/**
 * For unit tests only
 */
export function classesCacheSize() {
  return classesCache.size;
}
