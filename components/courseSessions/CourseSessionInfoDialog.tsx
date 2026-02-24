'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { useQuery } from '@tanstack/react-query';

import { courseSessionService } from '@/utils/action';

import type { CourseSession, Enrollment } from '@/utils/types/types';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  courseSessionId: string;
  triggerText?: string;
};

const CourseSessionInfoDialog = ({
  courseSessionId,
  triggerText = 'View',
}: Props) => {
  const [open, setOpen] = React.useState(false);

  const {
    data: session,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courseSessions', courseSessionId],
    queryFn: ({ signal }) =>
      courseSessionService.getById(courseSessionId, signal),
    enabled: open,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['courseSessions', courseSessionId, 'enrollments'],
    queryFn: ({ signal }) =>
      courseSessionService.getEnrollments(courseSessionId, signal),
    enabled: open,
  });

  const approved = enrollments.filter((e) => e.status === 'Approved');
  const pending = enrollments.filter((e) => e.status === 'Pending');
  const denied = enrollments.filter((e) => e.status === 'Denied');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-200'>
        <DialogHeader>
          <DialogTitle>Course session info</DialogTitle>
          <DialogDescription>
            View full details for this course session.
          </DialogDescription>
        </DialogHeader>

        {isPending && <div>Loading...</div>}

        {isError && (
          <div>
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        )}
        <ScrollArea className='h-[80vh]'>
          {session && (
            <div className='grid gap-4'>
              {/* Course */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Course</div>
                <div>{session.course.courseName}</div>
                <div className='text-sm opacity-70'>
                  Code: {session.courseCode}
                </div>
              </div>

              {/* Location */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Location</div>
                <div>{session.location.locationName}</div>
              </div>

              {/* Dates */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Dates</div>
                <div>{new Date(session.startDate).toLocaleString('sv-SE')}</div>
                <div>{new Date(session.endDate).toLocaleString('sv-SE')}</div>
              </div>

              {/* Capacity */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Capacity</div>
                <div>
                  {session.approvedEnrollmentsCount} / {session.capacity}
                </div>
              </div>

              {/* Instructors */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Instructors</div>

                {session.instructors.length === 0 && (
                  <div className='text-sm opacity-70'>None</div>
                )}

                {session.instructors.map((i) => (
                  <div key={i.id}>
                    {i.firstName} {i.lastName}
                  </div>
                ))}
              </div>
              {/* <ScrollArea className='h-36'> */}
              {/* Approved */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Approved students</div>

                {approved.length === 0 && (
                  <div className='text-sm opacity-70'>None</div>
                )}

                {approved.map((e) => (
                  <div key={e.id}>{e.studentName}</div>
                ))}
              </div>
              {/* </ScrollArea> */}
              {/* Pending */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Pending students</div>

                {pending.length === 0 && (
                  <div className='text-sm opacity-70'>None</div>
                )}

                {pending.map((e) => (
                  <div key={e.id}>{e.studentName}</div>
                ))}
              </div>

              {/* Denied */}
              <div className='rounded-md border p-4'>
                <div className='font-semibold'>Denied students</div>

                {denied.length === 0 && (
                  <div className='text-sm opacity-70'>None</div>
                )}

                {denied.map((e) => (
                  <div key={e.id}>{e.studentName}</div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CourseSessionInfoDialog;
