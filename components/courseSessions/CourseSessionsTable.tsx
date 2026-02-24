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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CreateCourseSessionDialog from './CreateCourseSessionDialog';
import EditCourseSessionDialog from './EditCourseSessionDialog';
import ManageEnrollmentsDialog from './ManageEnrollmentsDialog';
import { toast } from 'sonner';
import { ScrollArea } from '../ui/scroll-area';
import CourseSessionInfoDialog from './CourseSessionInfoDialog';
import { useMemo, useState } from 'react';
import SearchInput from '../global/SearchInput';

const PAGE_SIZE = 15;
const ROWS_TO_SHOW = 15;

const CourseSessionsTable = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['courseSessions', 'paged', page, PAGE_SIZE, search],
    queryFn: ({ signal }) =>
      courseSessionService.getPaged(
        { page, pageSize: PAGE_SIZE, q: search },
        signal,
      ),
    staleTime: 1000 * 5,
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseSessionService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseSessions', 'paged'] });
    },
  });

  const paged = useMemo(() => {
    return (
      data ?? {
        items: [],
        page,
        pageSize: PAGE_SIZE,
        total: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  }, [data, page]);

  const items = paged.items;

  const rowsToShow = useMemo(() => {
    const filled = items.slice(0, ROWS_TO_SHOW);
    const missing = ROWS_TO_SHOW - filled.length;

    return missing > 0 ? [...filled, ...Array(missing).fill(null)] : filled;
  }, [items]);

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

        <CreateCourseSessionDialog triggerText='New Course Session' />
      </div>

      <ScrollArea className='h-[60vh]'>
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
              <TableHead>Enrollments</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {rowsToShow.map((session, index) => {
              if (!session) {
                return (
                  <TableRow key={`empty-${index}`}>
                    <TableCell className='h-12'>&nbsp;</TableCell>
                  </TableRow>
                );
              }
              return (
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
                    {session.instructors.map(
                      ({
                        id,
                        firstName,
                        lastName,
                      }: {
                        id: string;
                        firstName: string;
                        lastName: string;
                      }) => (
                        <div key={id} className='my-1'>
                          <Link href={`/attendees/${id}`}>
                            {firstName} {lastName}
                          </Link>
                        </div>
                      ),
                    )}
                  </TableCell>

                  <TableCell>{session.capacity}</TableCell>

                  <TableCell>{session.approvedEnrollmentsCount}</TableCell>

                  <TableCell className='flex gap-3'>
                    <Trash2
                      className='cursor-pointer'
                      onClick={async () => {
                        const ok = window.confirm('Delete this courseSession?');
                        if (!ok) return;

                        toast.promise(deleteMutation.mutateAsync(session.id), {
                          loading: 'Deleting...',
                          success: 'Student deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        });
                      }}
                    />

                    <EditCourseSessionDialog session={session} />

                    <ManageEnrollmentsDialog
                      courseSessionId={session.id}
                      rowVersion={session.rowVersion}
                    />

                    <CourseSessionInfoDialog courseSessionId={session.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className='mt-4 flex items-center justify-between px-4'>
        <div className='text-sm opacity-70'>
          Page {paged.page} / {paged.totalPages || 1}
        </div>

        <div>
          <h3>Sessions ({paged.total})</h3>
        </div>

        <div className='flex items-center gap-2'>
          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!paged.hasPreviousPage || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <button
            className='border rounded px-3 py-1 disabled:opacity-50'
            disabled={!paged.hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSessionsTable;
