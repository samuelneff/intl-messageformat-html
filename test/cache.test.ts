import {
  classesCacheSize,
  clearBothCaches,
  getOrPutClassesCache,
  getOrPutWrapCache,
  // reduceCache,
  // setTagFunctionCacheSize,
  wrapCacheSize,
} from '../src/cache';
import { TagFunctions } from '../src/internal';

beforeEach(() => {
  clearBothCaches();
  expect(wrapCacheSize()).toBe(0);
  expect(classesCacheSize()).toBe(0);
});

test('simple getOrPutWrapCache', () => {
  const aFunc = {} as TagFunctions;
  const bFunc = {} as TagFunctions;
  const cFunc = {} as TagFunctions;
  const neverFunc = {} as TagFunctions;

  const aKey = {};
  const bKey = {};
  const cKey = {};

  const a1 = getOrPutWrapCache(aKey, () => aFunc);
  expect(wrapCacheSize()).toBe(1);
  expect(classesCacheSize()).toBe(0);
  expect(a1).toBe(aFunc);

  const a2 = getOrPutWrapCache(aKey, () => neverFunc);
  expect(wrapCacheSize()).toBe(1);
  expect(classesCacheSize()).toBe(0);
  expect(a2).toBe(aFunc);

  const b1 = getOrPutWrapCache(bKey, () => bFunc);
  expect(wrapCacheSize()).toBe(2);
  expect(classesCacheSize()).toBe(0);
  expect(b1).toBe(bFunc);

  const b2 = getOrPutWrapCache(bKey, () => neverFunc);
  expect(wrapCacheSize()).toBe(2);
  expect(classesCacheSize()).toBe(0);
  expect(b2).toBe(bFunc);

  const c1 = getOrPutWrapCache(cKey, () => cFunc);
  expect(wrapCacheSize()).toBe(3);
  expect(classesCacheSize()).toBe(0);
  expect(c1).toBe(cFunc);

  const c2 = getOrPutWrapCache(cKey, () => neverFunc);
  expect(wrapCacheSize()).toBe(3);
  expect(classesCacheSize()).toBe(0);
  expect(c2).toBe(cFunc);

  const a3 = getOrPutWrapCache(aKey, () => neverFunc);
  expect(wrapCacheSize()).toBe(3);
  expect(classesCacheSize()).toBe(0);
  expect(a3).toBe(aFunc);

  const b3 = getOrPutWrapCache(bKey, () => neverFunc);
  expect(wrapCacheSize()).toBe(3);
  expect(classesCacheSize()).toBe(0);
  expect(b3).toBe(bFunc);

  const c3 = getOrPutWrapCache(cKey, () => neverFunc);
  expect(wrapCacheSize()).toBe(3);
  expect(classesCacheSize()).toBe(0);
  expect(c3).toBe(cFunc);
});

test('simple getOrPutClassesCache', () => {

  const aFunc = {} as TagFunctions;
  const bFunc = {} as TagFunctions;
  const cFunc = {} as TagFunctions;
  const neverFunc = {} as TagFunctions;

  const aKey = [];
  const bKey = [];
  const cKey = [];

  const a1 = getOrPutClassesCache(aKey, () => aFunc);
  expect(classesCacheSize()).toBe(1);
  expect(wrapCacheSize()).toBe(0);
  expect(a1).toBe(aFunc);

  const a2 = getOrPutClassesCache(aKey, () => neverFunc);
  expect(classesCacheSize()).toBe(1);
  expect(wrapCacheSize()).toBe(0);
  expect(a2).toBe(aFunc);

  const b1 = getOrPutClassesCache(bKey, () => bFunc);
  expect(classesCacheSize()).toBe(2);
  expect(wrapCacheSize()).toBe(0);
  expect(b1).toBe(bFunc);

  const b2 = getOrPutClassesCache(bKey, () => neverFunc);
  expect(classesCacheSize()).toBe(2);
  expect(wrapCacheSize()).toBe(0);
  expect(b2).toBe(bFunc);

  const c1 = getOrPutClassesCache(cKey, () => cFunc);
  expect(classesCacheSize()).toBe(3);
  expect(wrapCacheSize()).toBe(0);
  expect(c1).toBe(cFunc);

  const c2 = getOrPutClassesCache(cKey, () => neverFunc);
  expect(classesCacheSize()).toBe(3);
  expect(wrapCacheSize()).toBe(0);
  expect(c2).toBe(cFunc);

  const a3 = getOrPutClassesCache(aKey, () => neverFunc);
  expect(classesCacheSize()).toBe(3);
  expect(wrapCacheSize()).toBe(0);
  expect(a3).toBe(aFunc);

  const b3 = getOrPutClassesCache(bKey, () => neverFunc);
  expect(classesCacheSize()).toBe(3);
  expect(wrapCacheSize()).toBe(0);
  expect(b3).toBe(bFunc);

  const c3 = getOrPutClassesCache(cKey, () => neverFunc);
  expect(classesCacheSize()).toBe(3);
  expect(wrapCacheSize()).toBe(0);
  expect(c3).toBe(cFunc);
});

test('caches are independent', () => {

});

test('setTagFunctionCacheSize', () => {

});

test('reduceCache only used once', () => {

});

test('reduceCache only by last used', () => {

});

test('reduceCache used once and last used', () => {

});

