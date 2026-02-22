'use client';

import { attendeeService } from '@/utils/action';
import Link from 'next/link';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CDialog from '@/components/dialog/CDialog';
import { buildAttendeeEdit } from '@/components/forms/fieldBuilders';

import type {
  UpdateAttendeeDTO,
  UpdateAttendeeFormValues,
} from '@/utils/types/dto';

const InstructorsTable = () => {
  const queryClient = useQueryClient();

  const {
    data: instructors = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['attendees', 'instructors'],
    queryFn: ({ signal }) => attendeeService.getAllInstructors(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAttendeeDTO }) =>
      attendeeService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendees', 'instructors'] });
    },
  });

  const isAbort = error instanceof DOMException && error.name === 'AbortError';

  if (isPending) return <div>Loading...</div>;
  if (isAbort) return null;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'},
      </div>
    );

  return (
    <>
      <Table>
        <TableCaption>Instructors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {instructors.map((instructor) => {
            const { fields, initialValues } = buildAttendeeEdit(instructor);

            return (
              <TableRow key={instructor.id}>
                <TableCell>
                  <Link href={`/attendees/${instructor.id}`}>
                    {instructor.firstName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/attendees/${instructor.id}`}>
                    {instructor.lastName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/attendees/${instructor.id}`}>
                    {instructor.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/attendees/${instructor.id}`}>
                    {instructor.phoneNumber}
                  </Link>
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Trash2 />

                  <CDialog<UpdateAttendeeFormValues>
                    title='Edit instructor'
                    description="Make changes to the instructor. Click save when you're done."
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {updateMutation.isError ? (
        <div className='mt-4'>
          Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </>
  );
};

export default InstructorsTable;
