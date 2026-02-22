'use client';

import { locationService } from '@/utils/action';
import Link from 'next/link';
import React from 'react';
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
import { Button } from '../ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildLocationEdit } from '@/components/forms/fieldBuilders';

import type {
  UpdateLocationDTO,
  UpdateLocationFormValues,
} from '@/utils/types/dto';

const LocationsTable = () => {
  const queryClient = useQueryClient();

  const {
    data: locations = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: ({ signal }) => locationService.getAll(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLocationDTO }) =>
      locationService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
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
        <TableCaption>Locations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>City</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {locations.map((location) => {
            const { fields, initialValues } = buildLocationEdit(location);

            return (
              <TableRow key={location.id}>
                <TableCell className='text-center'>
                  <Link href={`/locations/${location.id}`}>
                    {location.locationName}
                  </Link>
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Trash2 />

                  <CDialog<UpdateLocationFormValues>
                    title='Edit location'
                    description='Change the city name and click save.'
                    fields={fields}
                    initialValues={initialValues}
                    onSave={(values) => {
                      console.log('ON_SAVE FIRED', values);
                      const dto: UpdateLocationDTO = {
                        rowVersion: values.rowVersion,
                        locationName: values.locationName,
                      };
                      console.log('FRONTEND DTO', dto);
                      updateMutation.mutate({ id: values.id, dto });
                      console.log(values.rowVersion, values.locationName);
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Button>New Location</Button>

      {updateMutation.isError ? (
        <div className='mt-4'>
          Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </>
  );
};

export default LocationsTable;
