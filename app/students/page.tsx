import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { attendeeService } from '@/utils/action';
import Link from 'next/link';

const Students = async () => {
  const students = await attendeeService.getAllStudents();
  return (
    <div className='flex flex-col w-full grow mt-[10dvh]'>
      <Table>
        <TableCaption>Students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(({ id, firstName, lastName, email, role }) => (
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
                <Link href={`/attendees/${id}`}>{role}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Students;
