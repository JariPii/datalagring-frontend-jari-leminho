import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const CButton = ({ children }: { children: string }) => {
  return (
    <button className='px-4 py-2 rounded-md bg-accent hover:bg-foreground hover:text-accent'>
      {children}
    </button>
  );
};

export default CButton;
