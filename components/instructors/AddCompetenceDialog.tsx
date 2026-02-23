'use client';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import CDialog from '@/components/dialog/CDialog';
import { buildAddCompetenceToInstructor } from '@/components/forms/fieldBuilders';

import { attendeeService } from '@/utils/action';
import { competenceService } from '@/utils/action'; // om du lade den där, annars korrekt import
import type { Competence } from '@/utils/types/types';
import type {
  AddCompetenceDTO,
  AddCompetenceFormValues,
} from '@/utils/types/dto';

type Props = {
  instructorId: string;
  rowVersion: string;
};

const AddCompetenceDialog = ({ instructorId, rowVersion }: Props) => {
  const queryClient = useQueryClient();

  const { data: competences = [] } = useQuery({
    queryKey: ['competences'],
    queryFn: ({ signal }) => competenceService.getAll(signal),
  });

  const { fields, initialValues } = buildAddCompetenceToInstructor(
    instructorId,
    rowVersion,
    competences as Competence[],
  );

  const addMutation = useMutation({
    mutationFn: (p: { instructorId: string; dto: AddCompetenceDTO }) =>
      attendeeService.addCompetence(p.instructorId, p.dto),
    onSuccess: async () => {
      // refresh instructors list so you see updated competences
      await queryClient.invalidateQueries({
        queryKey: ['attendees', 'instructors'],
      });
      toast.success('Competence added');
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Failed to add competence');
    },
  });

  return (
    <CDialog<AddCompetenceFormValues>
      title='Add competence'
      description='Select a competence and click save.'
      trigger={<Button variant='outline'>Add competence</Button>}
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const dto: AddCompetenceDTO = {
          competenceName: values.competenceName,
          rowVersion: values.rowVersion,
        };

        // toast.promise om du vill ha loading också:
        await toast.promise(
          addMutation.mutateAsync({ instructorId: values.instructorId, dto }),
          {
            loading: 'Adding competence...',
            success: 'Competence added',
            error: (err) =>
              err instanceof Error ? err.message : 'Failed to add competence',
          },
        );
      }}
    />
  );
};

export default AddCompetenceDialog;
