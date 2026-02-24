// 'use client';

// import { competenceService } from '@/utils/action';
// import Link from 'next/link';
// import {
//   Table,
//   TableCaption,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from '../ui/table';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Trash2 } from 'lucide-react';

// import CDialog from '@/components/dialog/CDialog';
// import { buildCompetenceEdit } from '@/components/forms/fieldBuilders';

// import type {
//   UpdateCompetenceDTO,
//   UpdateCompetenceFormValues,
//   UpdateLocationDTO,
// } from '@/utils/types/dto';
// import CreateCompetenceDialog from './CreateCompetenceDialog';
// import { toast } from 'sonner';
// import CompetenceInfoDialog from './CompetenceInfoDialog';

// const LocationsTable = () => {
//   const queryClient = useQueryClient();

//   const {
//     data: competences = [],
//     isPending,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['competences'],
//     queryFn: ({ signal }) => competenceService.getAll(signal),
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, dto }: { id: string; dto: UpdateLocationDTO }) =>
//       competenceService.update(id, dto),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['competences'] });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => competenceService.remove(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['competences'] });
//     },
//   });

//   if (isPending) return <div>Loading...</div>;

//   if (isError)
//     return (
//       <div>
//         Error: {error instanceof Error ? error.message : 'Unknown error'}
//       </div>
//     );

//   return (
//     <>
//       <Table>
//         <TableCaption>Competences</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Field</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {competences.map((competence) => {
//             const { fields, initialValues } = buildCompetenceEdit(competence);

//             return (
//               <TableRow key={competence.id}>
//                 <TableCell className='text-center'>
//                   <Link href={`/competences/${competence.id}`}>
//                     {competence.name}
//                   </Link>
//                 </TableCell>

//                 <TableCell className='flex gap-2'>
//                   <Trash2
//                     className='cursor-pointer'
//                     onClick={async () => {
//                       const ok = window.confirm('Delete this competence?');
//                       if (!ok) return;

//                       await toast.promise(
//                         deleteMutation.mutateAsync(competence.id),
//                         {
//                           loading: 'Deleting...',
//                           success: 'Location deleted',
//                           error: (e) =>
//                             e instanceof Error ? e.message : 'Failed to delete',
//                         },
//                       );
//                     }}
//                   />

//                   <CDialog<UpdateCompetenceFormValues>
//                     title='Edit location'
//                     description='Change the city name and click save.'
//                     fields={fields}
//                     initialValues={initialValues}
//                     onSave={(values) => {
//                       console.log('ON_SAVE FIRED', values);
//                       const dto: UpdateCompetenceDTO = {
//                         rowVersion: values.rowVersion,
//                         name: values.name,
//                       };
//                       console.log('FRONTEND DTO', dto);
//                       updateMutation.mutate({ id: values.id, dto });
//                       console.log(values.rowVersion, values.name);
//                     }}
//                   />

// <CompetenceInfoDialog
//   competence={competence}
//   triggerText='View'
// />
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>

//       <div className='flex justify-end mt-4'>
//         <CreateCompetenceDialog />
//       </div>
//     </>
//   );
// };

// export default LocationsTable;

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { competenceService } from '@/utils/action';
import type { Competence } from '@/utils/types/types';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import SearchInput from '../global/SearchInput';
import CDialog from '@/components/dialog/CDialog';
import { buildCompetenceEdit } from '@/components/forms/fieldBuilders';
import type {
  UpdateCompetenceDTO,
  UpdateCompetenceFormValues,
} from '@/utils/types/dto';
import CreateCompetenceDialog from './CreateCompetenceDialog';
import CompetenceInfoDialog from './CompetenceInfoDialog';
import { ScrollArea } from '../ui/scroll-area';

const PAGE_SIZE = 15;

const CompetencesTable = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(t);
  }, [searchInput]);

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['competences', 'paged', page, PAGE_SIZE, search],
    queryFn: ({ signal }) =>
      competenceService.getPaged(
        { page, pageSize: PAGE_SIZE, q: search },
        signal,
      ),
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  // ✅ så tabellen inte hoppar
  const rowsToShow = useMemo(() => {
    const filled = items.slice(0, PAGE_SIZE);
    const missing = PAGE_SIZE - filled.length;
    return missing > 0 ? [...filled, ...Array(missing).fill(null)] : filled;
  }, [items]);

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCompetenceDTO }) =>
      competenceService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => competenceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences'] });
    },
  });

  if (isPending) return <div>Loading...</div>;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  return (
    <div>
      <div className='flex justify-between'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <SearchInput value={searchInput} onChange={setSearchInput} />
          <div className='text-sm opacity-70'>
            {isFetching ? 'Updating…' : null}
          </div>
        </div>

        <CreateCompetenceDialog />
      </div>

      <ScrollArea className='h-[60vh]'>
        <Table>
          <TableCaption>Competences ({total})</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {rowsToShow.map((c, index) => {
              if (!c) {
                return (
                  <TableRow key={`empty-${index}`}>
                    <TableCell className='h-12' colSpan={2} />
                  </TableRow>
                );
              }

              const { fields, initialValues } = buildCompetenceEdit(
                c as Competence,
              );

              return (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>

                  <TableCell className='flex gap-2'>
                    <Trash2
                      className='cursor-pointer'
                      onClick={async () => {
                        const ok = window.confirm('Delete this competence?');
                        if (!ok) return;

                        await toast.promise(deleteMutation.mutateAsync(c.id), {
                          loading: 'Deleting...',
                          success: 'Competence deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        });
                      }}
                    />

                    <CDialog<UpdateCompetenceFormValues>
                      title='Edit competence'
                      description='Change the competence name and click save.'
                      fields={fields}
                      initialValues={initialValues}
                      onSave={(values) => {
                        const dto: UpdateCompetenceDTO = {
                          rowVersion: values.rowVersion,
                          name: values.name,
                        };

                        updateMutation.mutate({ id: values.id, dto });
                      }}
                    />

                    <CompetenceInfoDialog competence={c} triggerText='View' />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className='mt-4 flex items-center justify-between px-4'>
        <div className='text-sm opacity-70'>
          Page {page} / {totalPages}
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!hasPreviousPage || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {updateMutation.isError ? (
        <div className='mt-4'>
          Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </div>
  );
};

export default CompetencesTable;
