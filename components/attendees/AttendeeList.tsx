import { attendeeService } from '@/utils/action';

const AttendeeList = async () => {
  const attendees = await attendeeService.getAll();

  return (
    <ul>
      {attendees.map((a) => (
        <li key={a.id}>
          {a.firstName} {a.lastName}
        </li>
      ))}
    </ul>
  );
};

export default AttendeeList;
