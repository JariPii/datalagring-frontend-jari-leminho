import { ArrowDownAZ, ArrowUp, ArrowUpAZ } from 'lucide-react';
import { TableHead } from '../ui/table';

export type SortDirection = 'asc' | 'desc';

type SortTableHeadProps<T, K extends keyof T> = {
  label: string;
  column: K;
  sortKey: K;
  sortDir: SortDirection;
  onSort: (column: K) => void;
};

const SortTableHead = <T, K extends keyof T>({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
}: SortTableHeadProps<T, K>) => {
  const isActive = sortKey === column;
  return (
    <TableHead
      className='cursor-pointer select-none'
      onClick={() => onSort(column)}
    >
      <div className='flex items-center gap-1'>
        {label}
        {isActive &&
          (sortDir === 'asc' ? (
            <ArrowUpAZ size={14} />
          ) : (
            <ArrowDownAZ size={14} />
          ))}
      </div>
    </TableHead>
  );
};

export default SortTableHead;
