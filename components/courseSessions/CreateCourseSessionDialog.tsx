'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseSessionCreate } from '@/components/forms/fieldBuilders';

import {
  attendeeService,
  courseService,
  locationService,
  courseSessionService,
} from '@/utils/action';
import type {
  CreateCourseSessionDTO,
  CreateCourseSessionFormValues,
} from '@/utils/types/dto';

const CreateCourseSessionDialog = ({
  triggerText = 'New Course Session',
}: {
  triggerText?: string;
}) => {
  const queryClient = useQueryClient();

  const { data: courses = [], isPending: coursesPending } = useQuery({
    queryKey: ['courses'],
    queryFn: ({ signal }) => courseService.getAll(signal),
  });

  const { data: locations = [], isPending: locationsPending } = useQuery({
    queryKey: ['locations'],
    queryFn: ({ signal }) => locationService.getAll(signal),
  });

  const { data: instructors = [], isPending: instructorsPending } = useQuery({
    queryKey: ['attendees', 'instructors'],
    queryFn: ({ signal }) => attendeeService.getAllInstructors(signal),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateCourseSessionDTO) =>
      courseSessionService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseSessions'] });
    },
  });

  const loading = coursesPending || locationsPending || instructorsPending;

  const { fields, initialValues } = buildCourseSessionCreate(
    courses,
    locations,
    instructors,
  );

  return (
    <CDialog<CreateCourseSessionFormValues>
      title='New course session'
      description='Pick existing course/location/instructors, set dates and capacity.'
      trigger={
        <Button disabled={loading}>{loading ? 'Loading…' : triggerText}</Button>
      }
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        if (!values.courseCode) throw new Error('Select a course');
        if (!values.locationName) throw new Error('Select a location');
        if (!values.startDate) throw new Error('Select a start date');
        if (!values.endDate) throw new Error('Select an end date');

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

        const dto: CreateCourseSessionDTO = {
          courseCode: values.courseCode,
          locationName: values.locationName,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          capacity,
          instructorIds,
        };

        await createMutation.mutateAsync(dto);
      }}
    />
  );
};

export default CreateCourseSessionDialog;
