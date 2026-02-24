'use client';

import React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

import { attendeeService } from '@/utils/action';
import type { Attendee, Competence } from '@/utils/types/types';

type Props = {
  competence: Competence;
  triggerText?: string;
};

const CompetenceInfoDialog = ({ competence, triggerText = 'Info' }: Props) => {
  const [open, setOpen] = React.useState(false);

  const {
    data: instructors = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['attendees', 'instructors', 'competence', competence.name],
    queryFn: ({ signal }) =>
      attendeeService.getInstructorsByCompetence(competence.name, signal),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-187.5'>
        <DialogHeader>
          <DialogTitle>Competence details</DialogTitle>
          <DialogDescription>
            Shows which instructors have this competence.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4'>
          <div className='rounded-md border p-4'>
            <div className='text-base font-semibold'>{competence.name}</div>
            <div className='text-sm opacity-70'>
              Instructors: {(instructors as Attendee[]).length}
            </div>
          </div>

          <div className='rounded-md border p-4'>
            <div className='font-semibold mb-2'>Instructors</div>

            {isPending ? <div>Loading...</div> : null}

            {isError ? (
              <div>
                Error:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            ) : null}

            {!isPending &&
            !isError &&
            (instructors as Attendee[]).length === 0 ? (
              <div className='text-sm opacity-70'>No instructors found</div>
            ) : null}

            {!isPending &&
            !isError &&
            (instructors as Attendee[]).length > 0 ? (
              <div className='grid gap-2'>
                {(instructors as Attendee[]).map((i) => (
                  <div key={i.id} className='rounded-md border p-3 text-sm'>
                    <div className='font-medium'>
                      {i.firstName} {i.lastName}
                    </div>
                    <div className='opacity-80'>{i.email}</div>
                    <div className='mt-2'>
                      <Link className='underline' href={`/attendees/${i.id}`}>
                        View instructor
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompetenceInfoDialog;
