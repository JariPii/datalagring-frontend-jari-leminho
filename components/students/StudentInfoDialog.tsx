'use client';

import React, { useState } from 'react';
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
import { useQuery, useQueries } from '@tanstack/react-query';

import { attendeeService, courseSessionService } from '@/utils/action';
import type { CourseSession } from '@/utils/types/types';
import type { Enrollment } from '@/utils/types/types';

type Props = {
  studentId: string;
  triggerText?: string;
};

const StudentInfoDialog = ({ studentId, triggerText = 'View' }: Props) => {
  const [open, setOpen] = useState(false);

  const {
    data: student,
    isPending: isStudentPending,
    isError: isStudentError,
    error: studentError,
  } = useQuery({
    queryKey: ['attendees', studentId],
    queryFn: () => attendeeService.getById(studentId),
    enabled: open,
  });

  const {
    data: sessions = [],
    isPending: isSessionsPending,
    isError: isSessionsError,
    error: sessionsError,
  } = useQuery({
    queryKey: ['courseSessions'],
    queryFn: ({ signal }) => courseSessionService.getAll(signal),
    enabled: open,
  });

  const enrollmentQueries = useQueries({
    queries: (sessions as CourseSession[]).map((s) => ({
      queryKey: ['courseSessions', s.id, 'enrollments'],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        courseSessionService.getEnrollments(s.id, signal),
      enabled: open && (sessions as CourseSession[]).length > 0,
    })),
  });

  const isEnrollmentsPending = enrollmentQueries.some((q) => q.isPending);
  const enrollmentsErrorQuery = enrollmentQueries.find((q) => q.isError);
  const enrollmentsError = enrollmentsErrorQuery?.error;

  const sessionsWithStudentEnrollment = React.useMemo(() => {
    const list = sessions as CourseSession[];

    return list
      .map((s, idx) => {
        const enrollments = (enrollmentQueries[idx]?.data ??
          []) as Enrollment[];
        const enrollment = enrollments.find((e) => e.studentId === studentId);
        return enrollment ? { session: s, enrollment } : null;
      })
      .filter(Boolean) as Array<{
      session: CourseSession;
      enrollment: Enrollment;
    }>;
  }, [sessions, enrollmentQueries, studentId]);

  const approved = sessionsWithStudentEnrollment.filter(
    (x) => x.enrollment.status === 'Approved',
  );
  const pending = sessionsWithStudentEnrollment.filter(
    (x) => x.enrollment.status === 'Pending',
  );
  const denied = sessionsWithStudentEnrollment.filter(
    (x) => x.enrollment.status === 'Denied',
  );

  const fullName = student ? `${student.firstName} ${student.lastName}` : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-212.5'>
        <DialogHeader>
          <DialogTitle>Student details</DialogTitle>
          <DialogDescription>
            Personal info and enrollments (pending/approved/denied).
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4'>
          {isStudentPending ? <div>Loading student...</div> : null}

          {isStudentError ? (
            <div>
              Error:{' '}
              {studentError instanceof Error
                ? studentError.message
                : 'Unknown error'}
            </div>
          ) : null}

          {!isStudentPending && !isStudentError && student ? (
            <div className='rounded-md border p-4 grid gap-2'>
              <div className='text-base font-semibold'>{fullName}</div>

              <div className='text-sm opacity-80'>
                Email:{' '}
                <span className='font-medium opacity-100'>{student.email}</span>
              </div>

              <div className='text-sm opacity-80'>
                Phone:{' '}
                <span className='font-medium opacity-100'>
                  {student.phoneNumber ?? '-'}
                </span>
              </div>

              <div className='text-sm opacity-80'>
                Created:{' '}
                <span className='font-medium opacity-100'>
                  {new Date(student.createdAt).toLocaleString('sv-SE')}
                </span>
              </div>
            </div>
          ) : null}

          <div className='rounded-md border p-4'>
            <div className='flex items-center justify-between gap-4'>
              <div className='font-semibold'>Enrollments</div>
              <div className='text-xs opacity-70'>
                Approved: {approved.length} • Pending: {pending.length} •
                Denied: {denied.length}
              </div>
            </div>

            {isSessionsPending ? (
              <div className='mt-2'>Loading sessions...</div>
            ) : null}
            {isSessionsError ? (
              <div className='mt-2'>
                Error:{' '}
                {sessionsError instanceof Error
                  ? sessionsError.message
                  : 'Unknown error'}
              </div>
            ) : null}

            {!isSessionsPending && !isSessionsError && isEnrollmentsPending ? (
              <div className='mt-2'>Loading enrollments...</div>
            ) : null}

            {enrollmentsError ? (
              <div className='mt-2'>
                Error:{' '}
                {enrollmentsError instanceof Error
                  ? enrollmentsError.message
                  : 'Unknown error'}
              </div>
            ) : null}

            {!isSessionsPending &&
            !isSessionsError &&
            !isEnrollmentsPending &&
            !enrollmentsError ? (
              sessionsWithStudentEnrollment.length === 0 ? (
                <div className='mt-2 text-sm opacity-70'>
                  No enrollments for this student
                </div>
              ) : (
                <div className='mt-3 grid gap-3'>
                  {[
                    { title: 'Approved', data: approved },
                    { title: 'Pending', data: pending },
                    { title: 'Denied', data: denied },
                  ].map((group) => (
                    <div key={group.title} className='grid gap-2'>
                      <div className='text-sm font-semibold'>{group.title}</div>

                      {group.data.length === 0 ? (
                        <div className='text-sm opacity-70'>—</div>
                      ) : (
                        group.data.map(({ session, enrollment }) => (
                          <div
                            key={session.id}
                            className='rounded-md border p-3 text-sm'
                          >
                            <div className='font-medium'>
                              {session.course.courseName} • {session.courseCode}
                            </div>

                            <div className='opacity-80'>
                              {new Date(session.startDate).toLocaleString(
                                'sv-SE',
                              )}{' '}
                              →{' '}
                              {new Date(session.endDate).toLocaleString(
                                'sv-SE',
                              )}
                            </div>

                            <div className='opacity-80'>
                              Location: {session.location.locationName} •
                              Capacity: {session.capacity}
                            </div>

                            <div className='opacity-80'>
                              Enrolled:{' '}
                              {new Date(enrollment.enrolledAt).toLocaleString(
                                'sv-SE',
                              )}
                            </div>

                            <div className='mt-2'>
                              <Link
                                className='underline'
                                href={`/courseSessions/${session.id}`}
                              >
                                View session
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentInfoDialog;
