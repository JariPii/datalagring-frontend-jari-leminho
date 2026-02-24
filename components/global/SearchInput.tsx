'use client';

import { Input } from '@/components/ui/input';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchInput = ({ value, onChange, placeholder }: Props) => {
  return (
    <div className='max-w-sm'>
      <Input
        value={value}
        placeholder={placeholder ?? 'Search...'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
