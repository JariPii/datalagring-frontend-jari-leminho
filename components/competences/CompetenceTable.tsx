'use client';

import { competenceService } from '@/utils/action';
import Link from 'next/link';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CDialog from '@/components/dialog/CDialog';
import { buildCompetenceEdit } from '@/components/forms/fieldBuilders';

import type {
  UpdateCompetenceDTO,
  UpdateCompetenceFormValues,
  UpdateLocationDTO,
} from '@/utils/types/dto';
import CreateCompetenceDialog from './CreateCompetenceDialog';
import { toast } from 'sonner';

const LocationsTable = () => {
  const queryClient = useQueryClient();

  const {
    data: competences = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['competences'],
    queryFn: ({ signal }) => competenceService.getAll(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLocationDTO }) =>
      competenceService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => competenceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences'] });
    },
  });

  if (isPending) return <div>Loading...</div>;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  return (
    <>
      <Table>
        <TableCaption>Competences</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {competences.map((competence) => {
            const { fields, initialValues } = buildCompetenceEdit(competence);

            return (
              <TableRow key={competence.id}>
                <TableCell className='text-center'>
                  <Link href={`/competences/${competence.id}`}>
                    {competence.name}
                  </Link>
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Trash2
                    className='cursor-pointer'
                    onClick={async () => {
                      const ok = window.confirm('Delete this competence?');
                      if (!ok) return;

                      await toast.promise(
                        deleteMutation.mutateAsync(competence.id),
                        {
                          loading: 'Deleting...',
                          success: 'Location deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        },
                      );
                    }}
                  />

                  <CDialog<UpdateCompetenceFormValues>
                    title='Edit location'
                    description='Change the city name and click save.'
                    fields={fields}
                    initialValues={initialValues}
                    onSave={(values) => {
                      console.log('ON_SAVE FIRED', values);
                      const dto: UpdateCompetenceDTO = {
                        rowVersion: values.rowVersion,
                        name: values.name,
                      };
                      console.log('FRONTEND DTO', dto);
                      updateMutation.mutate({ id: values.id, dto });
                      console.log(values.rowVersion, values.name);
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className='flex justify-end mt-4'>
        <CreateCompetenceDialog />
      </div>
      {/* 
      {updateMutation.isError ? (
        <div className='mt-4'>
          Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null} */}
    </>
  );
};

export default LocationsTable;
