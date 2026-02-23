'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildCompetenceCreate } from '@/components/forms/fieldBuilders';

import { competenceService } from '@/utils/action';
import type {
  CreateCompetenceDTO,
  CreateCompetenceFormValues,
} from '@/utils/types/dto';

const CreateCompetenceDialog = () => {
  const queryClient = useQueryClient();
  const { fields, initialValues } = buildCompetenceCreate();

  const createMutation = useMutation({
    mutationFn: (dto: CreateCompetenceDTO) => competenceService.create(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['competences'] });
    },
  });

  return (
    <CDialog<CreateCompetenceFormValues>
      title='New competence'
      description='Enter a competence name and click save.'
      trigger={<Button>New Competence</Button>}
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const dto: CreateCompetenceDTO = {
          name: values.name.trim(),
        };

        if (!dto.name) throw new Error('Competence name is required');

        await toast.promise(createMutation.mutateAsync(dto), {
          loading: 'Creating competence...',
          success: 'Competence created',
          error: (e) => (e instanceof Error ? e.message : 'Failed to create'),
        });
      }}
    />
  );
};

export default CreateCompetenceDialog;
