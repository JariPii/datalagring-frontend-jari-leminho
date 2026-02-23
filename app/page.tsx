import CButton from '@/components/Button/CButton';
import CDialog from '@/components/dialog/CDialog';
import TableContainer from '@/components/table/TableContainer';
import { Dialog } from '@/components/ui/dialog';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className='flex flex-col w-full grow p-7'>
      <div className='min-h-14 flex items-center flex-col grow  justify-center'>
        <Suspense fallback={null}>
          <TableContainer />
        </Suspense>
      </div>
    </main>
  );
}
