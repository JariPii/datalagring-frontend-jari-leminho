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
import { useQuery } from '@tanstack/react-query';
import { Trash2, Edit } from 'lucide-react';

const StudentsTable = () => {
  const {
    data: students = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['attendees', 'students'],
    queryFn: ({ signal }) => attendeeService.getAllStudents(signal),
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
      <Table>
        <TableCaption>Students</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <SortTableHead<Attendee, SortableAttendeeKey>
              label='Firstname'
              column='firstName'
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortTableHead<Attendee, SortableAttendeeKey>
              label='Lastname'
              column='lastName'
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortTableHead<Attendee, SortableAttendeeKey>
              label='Email'
              column='email'
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            /> */}
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Created At</TableHead>
            {/* <SortTableHead<Attendee, SortableAttendeeKey>
              label='Created'
              column='createdAt'
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            /> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(
            ({ id, firstName, lastName, email, phoneNumber, createdAt }) => (
              <TableRow key={id}>
                <TableCell>
                  <Link href={`/attendees/${id}`}>{firstName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/attendees/${id}`}>{lastName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/attendees/${id}`}>{email}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/attendees/${id}`}>{phoneNumber}</Link>
                </TableCell>
                <TableCell>
                  {new Date(createdAt).toLocaleString('sv-SE')}
                </TableCell>
                <TableCell className='flex gap-2'>
                  <Trash2 />
                  <Edit />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default StudentsTable;
