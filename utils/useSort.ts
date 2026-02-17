'use client';

import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

type SortKind = 'string' | 'number' | 'date';

const useSort = <T, K extends keyof T>(params: {
  data: T[];
  initialKey: K;
  initialDir?: SortDirection;
  kindByKey?: Partial<Record<K, SortKind>>;
}) => {
  const { data, initialKey, initialDir = 'asc', kindByKey } = params;

  const [sortKey, setSortKey] = useState<K>(initialKey);
  const [sortDir, setSortDir] = useState<SortDirection>(initialDir);

  const onSort = (key: K) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    const kind = kindByKey?.[sortKey] ?? 'string';

    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (kind === 'date') {
        const at = Date.parse(String(av ?? '')) || 0;
        const bt = Date.parse(String(bv ?? '')) || 0;
        return sortDir === 'asc' ? at - bt : bt - at;
      }

      if (kind === 'number') {
        const an = Number(av ?? 0);
        const bn = Number(bv ?? 0);
        return sortDir === 'asc' ? an - bn : bn - an;
      }

      const as = String(av ?? '').toLowerCase();
      const bs = String(bv ?? '').toLowerCase();
      if (as < bs) return sortDir === 'asc' ? -1 : 1;
      if (as > bs) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, kindByKey]);

  return { sorted, sortKey, sortDir, onSort };
};

export default useSort;
