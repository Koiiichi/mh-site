'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

type PointerOrigin = { x: number; y: number };

type LongPressEvent = {
  origin: PointerOrigin;
  pointerType: 'mouse' | 'touch' | 'keyboard';
  originalEvent: Event;
};

type LongPressOptions = {
  threshold?: number;
  moveTolerance?: number;
  onCancel?: () => void;
};

type LongPressHandlers = {
  onPointerDown: (event: ReactPointerEvent) => void;
  onPointerMove: (event: ReactPointerEvent) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onKeyDown: (event: ReactKeyboardEvent) => void;
  onKeyUp: () => void;
};

export function useLongPress(callback: (event: LongPressEvent) => void, options?: LongPressOptions): LongPressHandlers {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pointerOrigin = useRef<PointerOrigin | null>(null);
  const pointerActive = useRef(false);
  const triggered = useRef(false);
  const activated = useRef(false);
  const threshold = options?.threshold ?? 320;
  const tolerance = options?.moveTolerance ?? 6;

  const clearTimer = useCallback(
    (shouldTrigger = false, pointerType: LongPressEvent['pointerType'] = 'mouse', originalEvent?: Event) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!shouldTrigger) {
        pointerOrigin.current = null;
        pointerActive.current = false;
        triggered.current = false;
        activated.current = false;
        options?.onCancel?.();
        return;
      }

      if (pointerOrigin.current && originalEvent) {
        triggered.current = true;
        activated.current = true;
        callback({ origin: pointerOrigin.current, pointerType, originalEvent });
      }
      pointerOrigin.current = null;
      pointerActive.current = false;
      triggered.current = false;
    },
    [callback, options]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimer();
      }
    };
  }, [clearTimer]);

  const startPress = useCallback(
    (event: ReactPointerEvent) => {
      pointerActive.current = true;
      pointerOrigin.current = { x: event.clientX, y: event.clientY };
      timerRef.current = setTimeout(() => {
        clearTimer(true, event.pointerType as LongPressEvent['pointerType'], event.nativeEvent);
      }, threshold);
    },
    [clearTimer, threshold]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      startPress(event);
    },
    [startPress]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!pointerActive.current || !pointerOrigin.current) return;
      const dx = event.clientX - pointerOrigin.current.x;
      const dy = event.clientY - pointerOrigin.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > tolerance && !triggered.current) {
        clearTimer();
      }
    },
    [clearTimer, tolerance]
  );

  const handlePointerUp = useCallback(() => {
    if (activated.current) {
      activated.current = false;
      pointerActive.current = false;
      return;
    }
    if (!triggered.current) {
      clearTimer();
    }
    pointerActive.current = false;
  }, [clearTimer]);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      pointerOrigin.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      timerRef.current = setTimeout(() => {
        clearTimer(true, 'keyboard', event.nativeEvent);
      }, threshold);
    },
    [clearTimer, threshold]
  );

  const handleKeyUp = useCallback(() => {
    if (activated.current) {
      activated.current = false;
      return;
    }
    if (!triggered.current) {
      clearTimer();
    }
  }, [clearTimer]);

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerUp,
    onPointerCancel: handlePointerUp,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  };
}
