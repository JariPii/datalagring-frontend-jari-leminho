'use client';

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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseEdit } from '@/components/forms/fieldBuilders';

import CreateCourseDialog from './CreateCourseDialog';
import type {
  UpdateCourseDTO,
  UpdateCourseFormValues,
} from '@/utils/types/dto';
import { toast } from 'sonner';
import CourseInfoDialog from './CourseInfoDialog';
import { ScrollArea } from '../ui/scroll-area';
import { useMemo, useState } from 'react';

const PAGE_SIZE = 15;
const ROWS_TO_SHOW = 15;

const CoursesTable = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['courses', 'paged', page, PAGE_SIZE, search],
    queryFn: ({ signal }) =>
      courseService.getPaged({ page, pageSize: PAGE_SIZE, q: search }, signal),
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    placeholderData: (prev) => prev,
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

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCourseDTO }) =>
      courseService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
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
      <div className='flex justify-between'>
        <CreateCourseDialog />
      </div>
      <ScrollArea className='h-[60vh]'>
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
            {rowsToShow.map((course, index) => {
              if (!course) {
                return (
                  <TableRow key={`empty-${index}`}>
                    <TableCell className='h-12'>&nbsp;</TableCell>
                  </TableRow>
                );
              }

              const { fields, initialValues } = buildCourseEdit(course);

              return (
                <TableRow key={course.id}>
                  <TableCell>
                    <Link href={`/courses/${course.id}`}>
                      {course.courseName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/courses/${course.id}`}>
                      {String(course.courseType)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/courses/${course.id}`}>
                      {course.courseTypeName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/courses/${course.id}`}>
                      {course.courseCode}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/courses/${course.id}`}>
                      {course.courseDescription}
                    </Link>
                  </TableCell>

                  <TableCell className='flex gap-2'>
                    <Trash2
                      className='cursor-pointer'
                      onClick={async () => {
                        const ok = window.confirm('Delete this course?');
                        if (!ok) return;

                        toast.promise(deleteMutation.mutateAsync(course.id), {
                          loading: 'Deleting...',
                          success: 'Course deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        });
                      }}
                    />

                    <CDialog<UpdateCourseFormValues>
                      title='Edit course'
                      description="Edit the course. Click save when you're done."
                      fields={fields}
                      initialValues={initialValues}
                      onSave={async (values) => {
                        const dto: UpdateCourseDTO = {
                          rowVersion: values.rowVersion,
                          courseName: values.courseName,
                          courseCode: values.courseCode,
                          courseDescription: values.courseDescription,
                          courseType: values.courseType,
                        };

                        await updateMutation.mutateAsync({
                          id: values.id,
                          dto,
                        });
                      }}
                    />

                    <CourseInfoDialog course={course} triggerText='View' />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className='text-center'>
                Click a name to view attendee details
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>

      <div className='mt-4 flex items-center justify-between px-4'>
        <div className='text-sm opacity-70'>
          Page {paged.page} / {paged.totalPages || 1}
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

      {updateMutation.isError ? (
        <div className='mt-4'>
          Update error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </>
  );
};

export default CoursesTable;
