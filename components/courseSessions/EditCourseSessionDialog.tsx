'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseSessionEdit } from '@/components/forms/fieldBuilders';

import {
  attendeeService,
  courseService,
  locationService,
  courseSessionService,
} from '@/utils/action';

import type {
  UpdateCourseSessionDTO,
  UpdateCourseSessionFormValues,
} from '@/utils/types/dto';
import type { CourseSession } from '@/utils/types/types';

const EditCourseSessionDialog = ({ session }: { session: CourseSession }) => {
  const queryClient = useQueryClient();

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: ({ signal }) => courseService.getAll(signal),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: ({ signal }) => locationService.getAll(signal),
  });

  const { data: instructors = [] } = useQuery({
    queryKey: ['attendees', 'instructors'],
    queryFn: ({ signal }) => attendeeService.getAllInstructors(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCourseSessionDTO }) =>
      courseSessionService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseSessions'] });
    },
  });

  const { fields, initialValues } = buildCourseSessionEdit(
    session,
    courses,
    locations,
    instructors,
  );

  return (
    <CDialog<UpdateCourseSessionFormValues>
      title='Edit course session'
      description='Update the session and click save.'
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const capacity = Number(values.capacity);
        if (!Number.isFinite(capacity) || capacity <= 0) {
          throw new Error('Capacity must be a positive number');
        }

        const instructorIds = values.instructorIds
          ? values.instructorIds
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean)
          : [];

        const dto: UpdateCourseSessionDTO = {
          rowVersion: values.rowVersion,

          courseId: values.courseId,
          locationId: values.locationId,

          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),

          capacity,
          instructorIds,
        };

        await updateMutation.mutateAsync({ id: values.id, dto });
      }}
    />
  );
};

export default EditCourseSessionDialog;
