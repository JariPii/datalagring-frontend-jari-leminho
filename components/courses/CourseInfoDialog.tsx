'use client';

import React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

import { courseSessionService } from '@/utils/action';
import type { Course, CourseSession } from '@/utils/types/types';

type Props = {
  course: Course;
  triggerText?: string;
};

const CourseInfoDialog = ({ course, triggerText = 'Info' }: Props) => {
  const [open, setOpen] = React.useState(false);

  const {
    data: sessions = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courseSessions'],
    queryFn: ({ signal }) => courseSessionService.getAll(signal),
    enabled: open,
  });

  const courseSessions = React.useMemo(
    () =>
      (sessions as CourseSession[]).filter((s) => s.course?.id === course.id),
    [sessions, course.id],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-225'>
        <DialogHeader>
          <DialogTitle>Course details</DialogTitle>
          <DialogDescription>
            Info + course sessions linked to this course.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4'>
          <div className='rounded-md border p-4 grid gap-1'>
            <div className='text-base font-semibold'>{course.courseName}</div>
            <div className='text-sm opacity-80'>
              Type: {String(course.courseType)} • {course.courseTypeName}
            </div>
            <div className='text-sm opacity-80'>Code: {course.courseCode}</div>
            <div className='text-sm opacity-80'>{course.courseDescription}</div>
            <div className='text-sm opacity-70 mt-2'>
              Sessions: {courseSessions.length}
            </div>
          </div>

          <div className='rounded-md border p-4'>
            <div className='font-semibold mb-2'>Course sessions</div>

            {isPending ? <div>Loading sessions...</div> : null}

            {isError ? (
              <div>
                Error:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            ) : null}

            {!isPending && !isError && courseSessions.length === 0 ? (
              <div className='text-sm opacity-70'>No course sessions</div>
            ) : null}

            {!isPending && !isError && courseSessions.length > 0 ? (
              <div className='grid gap-2'>
                {courseSessions.map((s) => (
                  <div key={s.id} className='rounded-md border p-3 text-sm'>
                    <div className='font-medium'>
                      {s.courseCode} • {s.location.locationName}
                    </div>
                    <div className='opacity-80'>
                      {new Date(s.startDate).toLocaleString('sv-SE')} →{' '}
                      {new Date(s.endDate).toLocaleString('sv-SE')}
                    </div>
                    <div className='opacity-80'>
                      Capacity: {s.capacity} • Approved:{' '}
                      {s.approvedEnrollmentsCount}
                    </div>

                    <div className='mt-2'>
                      <Link
                        className='underline'
                        href={`/courseSessions/${s.id}`}
                      >
                        View session
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseInfoDialog;
