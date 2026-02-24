'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { courseSessionService } from '@/utils/action';
import type { Enrollment, EnrollmentStatus } from '@/utils/types/types';
import type { UpdateEnrollmentStatusDTO } from '@/utils/types/dto';
import { toast } from 'sonner';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  courseSessionId: string;
  rowVersion: string; // session rowVersion
};

const ManageEnrollmentsDialog = ({ courseSessionId, rowVersion }: Props) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const enrollmentsQueryKey = [
    'courseSessions',
    courseSessionId,
    'enrollments',
  ] as const;

  const {
    data: enrollments = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: enrollmentsQueryKey,
    queryFn: ({ signal }) =>
      courseSessionService.getEnrollments(courseSessionId, signal),
    enabled: open,
  });

  const statusMutation = useMutation({
    mutationFn: async (p: { studentId: string; status: EnrollmentStatus }) => {
      const dto: UpdateEnrollmentStatusDTO = {
        newStatus: p.status,
        rowVersion,
      };

      await courseSessionService.setEnrollmentStatus(
        courseSessionId,
        p.studentId,
        dto,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courseSessions'] });
      await queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });
    },
  });

  const setStatus = async (studentId: string, status: EnrollmentStatus) => {
    const verb = status === 'Approved' ? 'Approving' : 'Denying';
    const done = status === 'Approved' ? 'Student approved' : 'Student denied';

    await toast.promise(statusMutation.mutateAsync({ studentId, status }), {
      loading: `${verb}...`,
      success: done,
      error: (e) => (e instanceof Error ? e.message : 'Something went wrong'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Enrollments</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-160'>
        <DialogHeader>
          <DialogTitle>Manage enrollments</DialogTitle>
          <DialogDescription>
            Approve or deny students for this course session.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-3'>
          {isPending ? <div>Loading...</div> : null}

          {isError ? (
            <div>
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : null}

          {!isPending && !isError && enrollments.length === 0 ? (
            <div>No enrollments</div>
          ) : null}
          <ScrollArea className='h-[50vh]'>
            {!isPending && !isError
              ? enrollments.map((e: Enrollment) => (
                  <div
                    key={e.id}
                    className='flex items-center justify-between gap-4 rounded-md border p-3'
                  >
                    <div className='min-w-0'>
                      <div className='text-sm font-medium truncate'>
                        {e.studentName}
                      </div>
                      <div className='text-xs opacity-70'>
                        Status: {e.status} •{' '}
                        {new Date(e.enrolledAt).toLocaleString('sv-SE')}
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <Button
                        variant='secondary'
                        disabled={
                          statusMutation.isPending || e.status === 'Approved'
                        }
                        onClick={() => setStatus(e.studentId, 'Approved')}
                      >
                        Approve
                      </Button>

                      <Button
                        variant='destructive'
                        disabled={
                          statusMutation.isPending || e.status === 'Denied'
                        }
                        onClick={() => setStatus(e.studentId, 'Denied')}
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                ))
              : null}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageEnrollmentsDialog;
