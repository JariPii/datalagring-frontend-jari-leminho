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
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';

const CoursesTable = () => {
  const {
    data: courses = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: ({ signal }) => courseService.getAll(signal),
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  if (isPending) return <div>Loading</div>;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  return (
    <>
      <Table>
        <TableCaption>All Courses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Course Type</TableHead>
            <TableHead>Course Type Name</TableHead>
            <TableHead>Course Code</TableHead>
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
                  <Link href={`/courses/${id}`}>{courseName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseType}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseTypeName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseCode}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${id}`}>{courseDescription}</Link>
                </TableCell>
                <TableCell className='flex gap-2'>
                  <Trash2 />
                  <Edit />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className='text-center'>
              Click a name to view attendee details
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default CoursesTable;
