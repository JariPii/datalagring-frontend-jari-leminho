'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoursesTable from '../courses/CoursesTable';
import StudentsTable from '../students/StudentsTable';
import InstructorsTable from '../instructors/InstructorsTable';
import LocationsTable from '../locations/LocationsTable';
import CourseSessionsTable from '../courseSessions/CourseSessionsTable';
import { useRouter, useSearchParams } from 'next/navigation';
import CompetenceTable from '../competences/CompetenceTable';
import { ScrollArea } from '../ui/scroll-area';

const TableContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get('tab') ?? 'students';

  const handleTabChange = (value: string) => {
    router.replace(`?tab=${value}`);
  };

  return (
    <div className='w-full max-w-400 grow'>
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value='students'>Students</TabsTrigger>
          <TabsTrigger value='instructors'>Instructors</TabsTrigger>
          <TabsTrigger value='competences'>Competences</TabsTrigger>
          <TabsTrigger value='locations'>Locations</TabsTrigger>
          <TabsTrigger value='courses'>Courses</TabsTrigger>
          <TabsTrigger value='courseSessions'>CourseSessions</TabsTrigger>
        </TabsList>
        <TabsContent value='students'>
          <StudentsTable />
        </TabsContent>

        <TabsContent value='instructors'>
          <InstructorsTable />
        </TabsContent>

        <TabsContent value='competences'>
          <CompetenceTable />
        </TabsContent>

        <TabsContent value='locations'>
          <LocationsTable />
        </TabsContent>

        <TabsContent value='courses'>
          <CoursesTable />
        </TabsContent>

        <TabsContent value='courseSessions'>
          <CourseSessionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableContainer;
