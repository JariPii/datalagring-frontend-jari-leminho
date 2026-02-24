'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildAddCompetenceToInstructor } from '@/components/forms/fieldBuilders';

import { attendeeService, competenceService } from '@/utils/action';
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
    mutationFn: (p: { id: string; dto: AddCompetenceDTO }) =>
      attendeeService.addCompetenceToInstructor(p.id, p.dto),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['attendees', 'instructors', 'paged'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['attendees', instructorId],
        }),
      ]);
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

        await toast.promise(
          addMutation.mutateAsync({ id: values.instructorId, dto }),
          {
            loading: 'Adding competence...',
            success: 'Competence added',
            error: (e) =>
              e instanceof Error ? e.message : 'Failed to add competence',
          },
        );
      }}
    />
  );
};

export default AddCompetenceDialog;
