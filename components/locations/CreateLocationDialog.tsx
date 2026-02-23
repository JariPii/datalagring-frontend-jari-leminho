'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildLocationCreate } from '@/components/forms/fieldBuilders';
import { locationService } from '@/utils/action';

import type {
  CreateLocationDTO,
  CreateLocationFormValues,
} from '@/utils/types/dto';

const CreateLocationDialog = () => {
  const queryClient = useQueryClient();
  const { fields, initialValues } = buildLocationCreate();

  const createMutation = useMutation({
    mutationFn: (dto: CreateLocationDTO) => locationService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });

  return (
    <>
      <CDialog<CreateLocationFormValues>
        title='New location'
        description='Enter the city name and click save.'
        trigger={<Button>New Location</Button>}
        fields={fields}
        initialValues={initialValues}
        onSave={async (values) => {
          const dto: CreateLocationDTO = {
            locationName: values.locationName,
          };

          await createMutation.mutateAsync(dto);
        }}
      />

      {createMutation.isError ? (
        <div className='mt-4'>
          Error:{' '}
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </>
  );
};

export default CreateLocationDialog;
