'use client';

import React, { useMemo, useState } from 'react';
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

import { courseSessionService } from '@/utils/action';
import type { CourseSession, Location } from '@/utils/types/types';

type Props = {
  location: Location;
  triggerText?: string;
};

const LocationInfoDialog = ({ location, triggerText = 'Info' }: Props) => {
  const [open, setOpen] = useState(false);

  const {
    data: sessions = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courseSessions'],
    queryFn: ({ signal }) => courseSessionService.getAll(signal),
    enabled: open,
  });

  const locationSessions = useMemo(
    () =>
      (sessions as CourseSession[]).filter(
        (s) => s.location?.id === location.id,
      ),
    [sessions, location.id],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-200'>
        <DialogHeader>
          <DialogTitle>Location details</DialogTitle>
          <DialogDescription>
            Info + course sessions linked to this location.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4'>
          <div className='rounded-md border p-4'>
            <div className='text-base font-semibold'>
              {location.locationName}
            </div>
            <div className='text-sm opacity-70'>
              Sessions: {locationSessions.length}
            </div>
          </div>

          <div className='rounded-md border p-4'>
            <div className='font-semibold mb-2'>Course sessions</div>

            {isPending ? <div>Loading sessions...</div> : null}

            {isError ? (
              <div>
                Error:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            ) : null}

            {!isPending && !isError && locationSessions.length === 0 ? (
              <div className='text-sm opacity-70'>No course sessions</div>
            ) : null}

            {!isPending && !isError && locationSessions.length > 0 ? (
              <div className='grid gap-2'>
                {locationSessions.map((s) => (
                  <div key={s.id} className='rounded-md border p-3 text-sm'>
                    <div className='font-medium'>
                      {s.course.courseName} • {s.courseCode}
                    </div>
                    <div className='opacity-80'>
                      {new Date(s.startDate).toLocaleString('sv-SE')} →{' '}
                      {new Date(s.endDate).toLocaleString('sv-SE')}
                    </div>
                    <div className='opacity-80'>
                      Capacity: {s.capacity} • Approved:{' '}
                      {s.approvedEnrollmentsCount}
                    </div>

                    <div className='mt-2'>
                      <Link
                        className='underline'
                        href={`/courseSessions/${s.id}`}
                      >
                        View session
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

export default LocationInfoDialog;
