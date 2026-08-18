'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { pickItems, pickUniqueItems } from '@/lib/utils/random';
import { sleep } from '@/lib/utils/misc';

export function useItemDrawer<T>({ drawingPool = [], drawSize = 1, allowDuplicate = false }: { drawingPool?: T[]; drawSize?: number; allowDuplicate?: boolean } = {}) {
  const [currentItems, setCurrentItems] = useState<(T | undefined)[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentItemsRef = useRef<(T | undefined)[]>([]);
  const stopping = useRef(false);
  const restarting = useRef(false);
  const drawing = useRef(false);
  const drawRef = useRef({ drawingPool, drawSize, allowDuplicate });
  const setItemsState = useCallback((items: (T | undefined)[]) => {
    currentItemsRef.current = items;
    setCurrentItems(items);
  }, []);
  useEffect(() => { drawRef.current = { drawingPool, drawSize, allowDuplicate }; }, [allowDuplicate, drawSize, drawingPool]);
  const stopDrawing = useCallback(async () => {
    stopping.current = true;
    while (drawing.current) await sleep(10);
  }, []);
  const resetCurrentItems = useCallback(() => {
    const { drawingPool: pool, drawSize: size, allowDuplicate: duplicate } = drawRef.current;
    void stopDrawing();
    setItemsState(Array(Math.max(0, duplicate ? size : Math.min(size, pool.length))).fill(undefined));
  // resetCurrentItems intentionally reads the latest ref so callers can pass stable or changing pools.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { resetCurrentItems(); }, [drawingPool, drawSize, allowDuplicate, resetCurrentItems]);
  const startDrawing = useCallback(async (onFinish?: (result: (T | undefined)[]) => void) => {
    if (drawing.current) { restarting.current = true; return; }
    drawing.current = true; setIsDrawing(true); stopping.current = false;
    do {
      restarting.current = false;
      const { drawingPool: pool, drawSize: size, allowDuplicate: duplicate } = drawRef.current;
      if (pool.length === 0) { setItemsState(duplicate ? Array(size).fill(undefined) : []); break; }
      if (pool.length === 1) { setItemsState(duplicate ? Array(size).fill(pool[0]) : [pool[0]]); break; }
      for (let speed = 200; speed > 0; speed -= 5) {
        if (restarting.current || stopping.current) break;
        setItemsState(duplicate ? pickItems(pool, size) : pickUniqueItems(pool, size));
        await sleep(4000 / speed);
      }
    } while (restarting.current);
    if (!stopping.current) onFinish?.(currentItemsRef.current);
    drawing.current = false; setIsDrawing(false); stopping.current = false; restarting.current = false;
  }, [setItemsState]);
  const setItems = useCallback((items: (T | undefined)[]) => { void stopDrawing(); setItemsState(items); }, [setItemsState, stopDrawing]);
  return { currentItems, isDrawing, startDrawing, stopDrawing, setCurrentItems: setItems, resetCurrentItems };
}
