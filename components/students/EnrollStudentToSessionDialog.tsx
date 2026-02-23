'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildEnrollStudentToSession } from '@/components/forms/fieldBuilders';

import { courseSessionService } from '@/utils/action';
import type { CourseSession } from '@/utils/types/types';
import type {
  EnrollStudentDTO,
  EnrollStudentToSessionFormValues,
} from '@/utils/types/dto';
import { toast } from 'sonner';

const EnrollStudentToSessionDialog = ({ studentId }: { studentId: string }) => {
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery({
    queryKey: ['courseSessions'],
    queryFn: ({ signal }) => courseSessionService.getAll(signal),
  });

  const { fields, initialValues } = buildEnrollStudentToSession(
    studentId,
    sessions,
  );

  const enrollMutation = useMutation({
    mutationFn: (p: { courseSessionId: string; dto: EnrollStudentDTO }) =>
      courseSessionService.enrollStudent(p.courseSessionId, p.dto),

    onSuccess: () => {
      toast.success('Student enrolled');
      queryClient.invalidateQueries({ queryKey: ['courseSessions'] });
    },

    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to enroll');
    },
  });

  return (
    <>
      <CDialog<EnrollStudentToSessionFormValues>
        title='Enroll student'
        description='Select a course session and click save.'
        trigger={<Button>Enroll</Button>}
        fields={fields}
        initialValues={initialValues}
        onSave={async (values) => {
          const session = sessions.find(
            (s: CourseSession) => s.id === values.courseSessionId,
          );
          if (!session) throw new Error('Invalid course session');

          const dto: EnrollStudentDTO = {
            studentId: values.studentId,
            rowVersion: session.rowVersion,
          };

          toast.promise(
            enrollMutation.mutateAsync({
              courseSessionId: values.courseSessionId,
              dto,
            }),
            {
              loading: 'Enrolling...',
              success: 'Student enrolled',
              error: (e) =>
                e instanceof Error ? e.message : 'Failed to enroll',
            },
          );
        }}
      />
    </>
  );
};

export default EnrollStudentToSessionDialog;
