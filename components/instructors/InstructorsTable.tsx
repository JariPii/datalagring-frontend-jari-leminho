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
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';

const InstructorsTable = () => {
  const {
    data: instructors = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['attendees', 'instructors'],
    queryFn: ({ signal }) => attendeeService.getAllInstructors(signal),
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
        <TableCaption>Students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map(
            ({ id, firstName, lastName, email, phoneNumber }) => (
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

export default InstructorsTable;
