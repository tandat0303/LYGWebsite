import { useState, useCallback } from "react";

export interface BreadcrumbItem<T = unknown> {
  labelKey?: string;
  label?: string;
  data?: T;
}

export interface UseBreadcrumbReturn<T = unknown> {
  stack: BreadcrumbItem<T>[];
  current: BreadcrumbItem<T>;
  push: (item: BreadcrumbItem<T>) => void;
  goTo: (index: number) => void;
  goBack: () => void;
  canGoBack: boolean;
  depth: number;
}

export function useBreadcrumb<T = unknown>(
  root: BreadcrumbItem<T>,
): UseBreadcrumbReturn<T> {
  const [stack, setStack] = useState<BreadcrumbItem<T>[]>([root]);

  const push = useCallback((item: BreadcrumbItem<T>) => {
    setStack((prev) => [...prev, item]);
  }, []);

  const goTo = useCallback((index: number) => {
    setStack((prev) => prev.slice(0, index + 1));
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  return {
    stack,
    current: stack[stack.length - 1],
    push,
    goTo,
    goBack,
    canGoBack: stack.length > 1,
    depth: stack.length - 1,
  };
}
