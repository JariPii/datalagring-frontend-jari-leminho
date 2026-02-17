import { attendeeService } from '@/utils/action';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Link from 'next/link';
import { serverFetcher } from '@/utils/fetcher.server';
import { Attendee } from '@/utils/types/types';

const AttendeesTable = async () => {
  // const attendees = await attendeeService.getAll();
  const attendees = await serverFetcher<Attendee[]>('/attendees');

  return (
    <div className='w-full max-w-300'>
      <h1 className='font-bold text-2xl mb-6 underline'>Attendees</h1>
      <Table>
        <TableCaption>All attendees</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map(({ id, email, firstName, lastName, role }) => (
            <TableRow key={id}>
              <TableCell>
                <Link href={`/attendees/${id}`}>{email}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/attendees/${id}`}>{firstName}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/attendees/${id}`}>{lastName}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/attendees/${id}`}>{role}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className='text-center'>
              Click a name to view attendee details
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default AttendeesTable;
