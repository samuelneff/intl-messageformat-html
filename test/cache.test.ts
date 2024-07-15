// import { } from 'jest';
import {
  classesCacheSize,
  clearBothCaches,
  getOrPutClassesCache,
  getOrPutWrapCache,
  setTagFunctionCacheSize,
  // reduceCache,
  // setTagFunctionCacheSize,
  wrapCacheSize,
} from '../src/cache';
import { TagFunctions } from '../src/internal';

beforeEach(() => {
  clearBothCaches();
  expect(wrapCacheSize()).toBe(0);
  expect(classesCacheSize()).toBe(0);
  setTagFunctionCacheSize(100);
  jest.runAllTimers();
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

  const aKey = [] as string[];
  const bKey = [] as string[];
  const cKey = [] as string[];

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
  const a1Func = {} as TagFunctions;
  const b1Func = {} as TagFunctions;
  const c1Func = {} as TagFunctions;

  const a2Func = {} as TagFunctions;
  const b2Func = {} as TagFunctions;
  const c2Func = {} as TagFunctions;
  const neverFunc = {} as TagFunctions;

  const aKey = [] as string[];
  const bKey = [] as string[];
  const cKey = [] as string[];

  const a1 = getOrPutClassesCache(aKey, () => a1Func);
  const b1 = getOrPutClassesCache(bKey, () => b1Func);
  const c1 = getOrPutClassesCache(cKey, () => c1Func);

  const a2 = getOrPutWrapCache(aKey, () => a2Func);
  const b2 = getOrPutWrapCache(bKey, () => b2Func);
  const c2 = getOrPutWrapCache(cKey, () => c2Func);

  expect(classesCacheSize()).toBe(3);
  expect(wrapCacheSize()).toBe(3);
  expect(a1).toBe(a1Func);
  expect(b1).toBe(b1Func);
  expect(c1).toBe(c1Func);

  expect(a2).toBe(a2Func);
  expect(b2).toBe(b2Func);
  expect(c2).toBe(c2Func);

  const a3 = getOrPutClassesCache(aKey, () => neverFunc);
  const b3 = getOrPutClassesCache(bKey, () => neverFunc);
  const c3 = getOrPutClassesCache(cKey, () => neverFunc);

  const a4 = getOrPutWrapCache(aKey, () => neverFunc);
  const b4 = getOrPutWrapCache(bKey, () => neverFunc);
  const c4 = getOrPutWrapCache(cKey, () => neverFunc);

  expect(a3).toBe(a1Func);
  expect(b3).toBe(b1Func);
  expect(c3).toBe(c1Func);

  expect(a4).toBe(a2Func);
  expect(b4).toBe(b2Func);
  expect(c4).toBe(c2Func);

});

test('setTagFunctionCacheSize', () => {
  for (let i = 0; i < 100; i++) {
    const ck = [] as string[];
    const wk = {};
    getOrPutClassesCache(ck, () => ({}));
    getOrPutClassesCache(ck, () => ({}));
    getOrPutWrapCache(wk, () => ({}));
    getOrPutWrapCache(wk, () => ({}));
  }
  expect(classesCacheSize()).toBe(100);
  expect(wrapCacheSize()).toBe(100);

  setTagFunctionCacheSize(20);

  // doesn't take effect till next frame
  expect(classesCacheSize()).toBe(100);
  expect(wrapCacheSize()).toBe(100);

  jest.runAllTimers();

  // now reduced to 60% of cache size = 20 * 0.6 = 12
  expect(classesCacheSize()).toBe(12);
  expect(wrapCacheSize()).toBe(12);
});

test('reduceCache only used once', () => {
  // 10 items used twice so kept
  for (let i = 0; i < 10; i++) {
    const ck = [] as string[];
    getOrPutClassesCache(ck, () => ({}));
    getOrPutClassesCache(ck, () => ({}));
  }
  // 100 items used only once so automatically cleared from cache
  for (let i = 0; i < 100; i++) {
    const ck = [] as string[];
    getOrPutClassesCache(ck, () => ({}));
  }

  setTagFunctionCacheSize(20);
  expect(classesCacheSize()).toBe(110);

  jest.runAllTimers();

  expect(classesCacheSize()).toBe(10); // all items used more than once
});

test('reduceCache only by last used', () => {
  const neverFunc = {} as TagFunctions;
  const funcs = [] as TagFunctions[];
  const keys = [] as string[][];

  // create 88 older ones that'll get purged from cache
  for (let i = 0; i < 88; i++) {
    jest.setSystemTime(100000 + i);
    const key = [] as string[];
    getOrPutClassesCache(key,() => neverFunc);
    getOrPutClassesCache(key, () => neverFunc);
  }

  // now we'll create 12 that we'll keep
  for (let i = 0; i < 12; i++) {
    jest.setSystemTime(100100 + i);
    const key = [] as string[];
    const func = {} as TagFunctions;
    keys.push(key);
    funcs.push(func);
    getOrPutClassesCache(key, () => func);
    getOrPutClassesCache(key, () => func);
  }

  expect(classesCacheSize()).toBe(100);

  setTagFunctionCacheSize(20);

  jest.runAllTimers();

  expect(classesCacheSize()).toBe(12);

  for (let i = 0; i < funcs.length; i++) {
    const key = keys[ i ];
    const func = funcs[ i ];

    const cached = getOrPutClassesCache(key, () => neverFunc);
    expect(cached).toBe(func);
  }
});

test('reduceCache used once and last used', () => {
  const neverFunc = {} as TagFunctions;
  const funcs = [] as TagFunctions[];
  const keys = [] as string[][];

  // create 70 older ones that'll get purged from cache because they're older
  for (let i = 0; i < 70; i++) {
    jest.setSystemTime(100000 + i);
    const key = [] as string[];
    getOrPutClassesCache(key, () => neverFunc);
    getOrPutClassesCache(key, () => neverFunc);
  }

  // now we'll create 12 that we'll keep
  for (let i = 0; i < 12; i++) {
    jest.setSystemTime(100100 + i);
    const key = [] as string[];
    const func = {} as TagFunctions;
    keys.push(key);
    funcs.push(func);
    getOrPutClassesCache(key, () => func);
    getOrPutClassesCache(key, () => func);
  }

  // and create 18 that will get purged because they're only used once even though they're newer
  for (let i = 0; i < 18; i++) {
    jest.setSystemTime(100200 + i);
    const key = [] as string[];
    getOrPutClassesCache(key, () => neverFunc);
  }


  expect(classesCacheSize()).toBe(100);

  setTagFunctionCacheSize(20);

  jest.runAllTimers();

  expect(classesCacheSize()).toBe(12);

  for (let i = 0; i < funcs.length; i++) {
    const key = keys[ i ];
    const func = funcs[ i ];

    const cached = getOrPutClassesCache(key, () => neverFunc);
    expect(cached).toBe(func);
  }

});

