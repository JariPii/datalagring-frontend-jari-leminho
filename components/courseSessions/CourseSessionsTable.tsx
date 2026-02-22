'use client';

import { courseSessionService } from '@/utils/action';
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
import { Trash2 } from 'lucide-react';

import CreateCourseSessionDialog from './CreateCourseSessionDialog';
import EditCourseSessionDialog from './EditCourseSessionDialog';

const CourseSessionsTable = () => {
  const {
    data: courseSessions = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courseSessions'],
    queryFn: ({ signal }) => courseSessionService.getAll(signal),
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
        <TableCaption>Course Sessions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Course Code</TableHead>
            <TableHead>Start date</TableHead>
            <TableHead>End date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Instructors</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Approved students</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {courseSessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <Link href={`/courses/${session.course.id}`}>
                  {session.course.courseName}
                </Link>
              </TableCell>

              <TableCell>{session.courseCode}</TableCell>

              <TableCell>
                {new Date(session.startDate).toLocaleString('sv-SE')}
              </TableCell>

              <TableCell>
                {new Date(session.endDate).toLocaleString('sv-SE')}
              </TableCell>

              <TableCell>{session.location.locationName}</TableCell>

              <TableCell>
                {session.instructors.map(({ id, firstName, lastName }) => (
                  <div key={id} className='my-1'>
                    <Link href={`/attendees/${id}`}>
                      {firstName} {lastName}
                    </Link>
                  </div>
                ))}
              </TableCell>

              <TableCell>{session.capacity}</TableCell>

              <TableCell>{session.approvedEnrollmentsCount}</TableCell>

              <TableCell className='flex gap-3'>
                <Trash2 />
                {/* ✅ skicka HELA session */}
                <EditCourseSessionDialog session={session} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex justify-end mt-4'>
        <CreateCourseSessionDialog triggerText='New Course Session' />
      </div>
    </div>
  );
};

export default CourseSessionsTable;
