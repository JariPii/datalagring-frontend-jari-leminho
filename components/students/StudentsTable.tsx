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

const StudentsTable = () => {
  const queryClient = useQueryClient();

  const {
    data: students = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['attendees', 'students'],
    queryFn: ({ signal }) => attendeeService.getAllStudents(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateAttendeeDTO }) =>
      attendeeService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendees', 'students'] });
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
      <Table>
        <TableCaption>Students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => {
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
                  <Link href={`/attendees/${student.id}`}>{student.email}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/attendees/${student.id}`}>
                    {student.phoneNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(student.createdAt).toLocaleString('sv-SE')}
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Trash2 />

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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className='w-full flex justify-end px-4'>
        <CreateStudentDialog />
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

export default StudentsTable;
