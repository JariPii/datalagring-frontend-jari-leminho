'use client';

import { attendeeService } from '@/utils/action';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CDialog from '@/components/dialog/CDialog';
import { buildAttendeeEdit } from '@/components/forms/fieldBuilders';

import type {
  UpdateAttendeeDTO,
  UpdateAttendeeFormValues,
} from '@/utils/types/dto';

import CreateStudentDialog from './CreateStudentDialog';
import EnrollStudentToSessionDialog from './EnrollStudentToSessionDialog';
import StudentInfoDialog from './StudentInfoDialog';

import { toast } from 'sonner';
import SearchInput from '../global/SearchInput';
import React, { useEffect, useState } from 'react';
import type { PagedResultDTO } from '@/utils/types/types';
import type { Attendee } from '@/utils/types/types';
import { ScrollArea } from '../ui/scroll-area';

const PAGE_SIZE = 15;

const StudentsTable = () => {
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
    queryKey: ['attendees', 'students', 'paged', page, PAGE_SIZE, search],
    queryFn: ({ signal }) =>
      attendeeService.getStudentsPaged(
        { page, pageSize: PAGE_SIZE, q: search },
        signal,
      ),
    placeholderData: (prev) => prev,
  });

  const result =
    data ??
    ({
      items: [],
      page,
      pageSize: PAGE_SIZE,
      total: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    } as PagedResultDTO<Attendee>);

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAttendeeDTO }) =>
      attendeeService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['attendees', 'students', 'paged'],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => attendeeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['attendees', 'students', 'paged'],
      });
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

        <CreateStudentDialog />
      </div>
      <ScrollArea className='h-[60vh]'>
        <Table>
          {/* <TableCaption>Students ({result.total})</TableCaption> */}

          <TableHeader>
            <TableRow>
              <TableHead>Firstname</TableHead>
              <TableHead>Lastname</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {result.items.map((student) => {
              const { fields, initialValues } = buildAttendeeEdit(student);

              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Link href={`/attendees/${student.id}`}>
                      {student.firstName}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link href={`/attendees/${student.id}`}>
                      {student.lastName}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link href={`/attendees/${student.id}`}>
                      {student.email}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link href={`/attendees/${student.id}`}>
                      {student.phoneNumber ?? ''}
                    </Link>
                  </TableCell>

                  <TableCell>
                    {new Date(student.createdAt).toLocaleString('sv-SE')}
                  </TableCell>

                  <TableCell className='flex gap-2'>
                    <Trash2
                      className='cursor-pointer'
                      onClick={async () => {
                        const ok = window.confirm('Delete this student?');
                        if (!ok) return;

                        toast.promise(deleteMutation.mutateAsync(student.id), {
                          loading: 'Deleting...',
                          success: 'Student deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        });
                      }}
                    />

                    <CDialog<UpdateAttendeeFormValues>
                      title='Edit student'
                      description="Make changes to the student. Click save when you're done."
                      fields={fields}
                      initialValues={initialValues}
                      onSave={(values) => {
                        const dto: UpdateAttendeeDTO = {
                          rowVersion: values.rowVersion,
                          firstName: values.firstName,
                          lastName: values.lastName,
                          email: values.email,
                          phoneNumber: values.phoneNumber.trim()
                            ? values.phoneNumber
                            : null,
                        };

                        updateMutation.mutate({ id: values.id, dto });
                      }}
                    />

                    <EnrollStudentToSessionDialog studentId={student.id} />

                    <StudentInfoDialog
                      studentId={student.id}
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
          Page {result.page} / {result.totalPages || 1}
        </div>

        <div>
          <h3>Students ({result.total})</h3>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!result.hasPreviousPage || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!result.hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentsTable;
