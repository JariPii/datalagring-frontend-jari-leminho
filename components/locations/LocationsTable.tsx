'use client';

import { locationService } from '@/utils/action';
import Link from 'next/link';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CDialog from '@/components/dialog/CDialog';
import { buildLocationEdit } from '@/components/forms/fieldBuilders';

import type {
  UpdateLocationDTO,
  UpdateLocationFormValues,
} from '@/utils/types/dto';
import CreateLocationDialog from './CreateLocationDialog';
import { toast } from 'sonner';
import LocationInfoDialog from './LocationInfoDialog';
import { useMemo, useState } from 'react';
import SearchInput from '../global/SearchInput';
import { ScrollArea } from '../ui/scroll-area';

const PAGE_SIZE = 15;
const ROWS_TO_SHOW = 15;

const LocationsTable = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['locations', 'paged', page, PAGE_SIZE, search],
    queryFn: ({ signal }) =>
      locationService.getPaged(
        { page, pageSize: PAGE_SIZE, q: search },
        signal,
      ),
    placeholderData: (prev) => prev,
  });

  const paged = useMemo(() => {
    return (
      data ?? {
        items: [],
        page,
        pageSize: PAGE_SIZE,
        total: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  }, [data, page]);

  const items = paged.items;

  const rowsToShow = useMemo(() => {
    const filled = items.slice(0, ROWS_TO_SHOW);
    const missing = ROWS_TO_SHOW - filled.length;

    return missing > 0 ? [...filled, ...Array(missing).fill(null)] : filled;
  }, [items]);

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLocationDTO }) =>
      locationService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', 'paged'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => locationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', 'paged'] });
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
    <>
      <div className='flex justify-between'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <SearchInput value={searchInput} onChange={setSearchInput} />
          <div className='text-sm opacity-70'>
            {isFetching ? 'Updating…' : null}
          </div>
        </div>

        <CreateLocationDialog />
      </div>

      <ScrollArea className='h-[60vh]'>
        <Table>
          <TableCaption>Locations ({paged.total}) </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rowsToShow.map((location, index) => {
              if (!location) {
                return (
                  <TableRow key={`empty-${index}`}>
                    <TableCell className='h-12'>&nbsp;</TableCell>
                  </TableRow>
                );
              }
              const { fields, initialValues } = buildLocationEdit(location);

              return (
                <TableRow key={location.id} className='px-28'>
                  <TableCell className='text-start'>
                    <Link href={`/locations/${location.id}`}>
                      {location.locationName}
                    </Link>
                  </TableCell>

                  <TableCell className='flex gap-2 justify-end'>
                    <Trash2
                      className='cursor-pointer'
                      onClick={async () => {
                        const ok = window.confirm('Delete this location?');
                        if (!ok) return;

                        toast.promise(deleteMutation.mutateAsync(location.id), {
                          loading: 'Deleting...',
                          success: 'Location deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        });
                      }}
                    />

                    <CDialog<UpdateLocationFormValues>
                      title='Edit location'
                      description='Change the city name and click save.'
                      fields={fields}
                      initialValues={initialValues}
                      onSave={(values) => {
                        console.log('ON_SAVE FIRED', values);
                        const dto: UpdateLocationDTO = {
                          rowVersion: values.rowVersion,
                          locationName: values.locationName,
                        };
                        console.log('FRONTEND DTO', dto);
                        updateMutation.mutate({ id: values.id, dto });
                        console.log(values.rowVersion, values.locationName);
                      }}
                    />

                    <LocationInfoDialog
                      location={location}
                      triggerText='View'
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className='mt-4 flex items-center justify-between px-4'>
        <div className='text-sm opacity-70'>
          Page {paged.page} / {paged.totalPages || 1}
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!paged.hasPreviousPage || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!paged.hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default LocationsTable;
