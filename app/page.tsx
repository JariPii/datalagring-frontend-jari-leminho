import TableContainer from '@/components/table/TableContainer';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className='flex flex-col w-full grow mt-[10dvh]'>
      <div className='min-h-14 flex items-center flex-col grow py-20 justify-center'>
        <Suspense fallback={null}>
          <TableContainer />
        </Suspense>
      </div>
    </main>
  );
}
