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

import type {
  UpdateCourseDTO,
  UpdateCourseFormValues,
} from '@/utils/types/dto';

const CoursesTable = () => {
  const queryClient = useQueryClient();

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

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCourseDTO }) =>
      courseService.update(id, dto),
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
          {courses.map((course) => {
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
                    {String(course.courseTypeName)}
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
                  <Trash2 />

                  <CDialog<UpdateCourseFormValues>
                    title='Edit course'
                    description="Edit the course fields. Click save when you're done."
                    fields={fields}
                    initialValues={initialValues}
                    onSave={async (values) => {
                      const dto: UpdateCourseDTO = {
                        rowVersion: values.rowVersion,
                        courseName: values.courseName,
                        courseType: values.courseType,
                        courseTypeName: values.courseTypeName,
                        courseCode: values.courseCode,
                        courseDescription: values.courseDescription,
                      };

                      await updateMutation.mutateAsync({ id: values.id, dto });
                    }}
                  />
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

      <Button>Test2</Button>

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
