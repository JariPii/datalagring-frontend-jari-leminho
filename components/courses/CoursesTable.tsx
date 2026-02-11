import { courseService } from '@/utils/action';
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

const CoursesTable = async () => {
  const courses = await courseService.getAll();
  return (
    <>
      <h1 className='font-bold text-2xl mb-6 underline'>Courses</h1>
      <Table>
        <TableCaption>All Courses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course Code</TableHead>
            <TableHead>Course Type</TableHead>
            <TableHead>Course Type Name</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Course Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(
            ({
              id,
              courseCode,
              courseType,
              courseTypeName,
              courseName,
              courseDescription,
            }) => (
              <TableRow key={id}>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseCode}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseType}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseTypeName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseDescription}</Link>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className='text-center'>
              Click a name to view attendee details
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default CoursesTable;
