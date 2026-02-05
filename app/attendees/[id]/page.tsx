import { attendeeService } from '@/utils/action';

const Attendee = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const attendee = await attendeeService.getById(id);

  const { firstName, lastName, email, phoneNumber, role } = attendee;

  return (
    <div>
      <h2>
        {firstName} {lastName} -- {role}
      </h2>
      <p>Email {email}</p>
      <p>Phone {phoneNumber}</p>
      {attendee.competences && attendee.competences.length > 0 ? (
        <div>
          {attendee.competences.map((c: { id: string; name: string }) => (
            <span key={c.id}>{c.name}</span>
          ))}
        </div>
      ) : (
        <p>Elev</p>
      )}
    </div>
  );
};

export default Attendee;
