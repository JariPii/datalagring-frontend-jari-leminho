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
import { useQuery } from '@tanstack/react-query';
import { Trash2, Edit } from 'lucide-react';

const LocationsTable = () => {
  const {
    data: locations = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: ({ signal }) => locationService.getAll(signal),
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
          {locations.map(({ id, locationName }) => (
            <TableRow key={id}>
              <TableCell className='text-center'>
                <Link href={`/locations/${id}`}>{locationName}</Link>
              </TableCell>
              <TableCell className='flex gap-2'>
                <Trash2 />
                <Edit />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default LocationsTable;
