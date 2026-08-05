import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/site/admin/action-button";
import { EventFormDialog } from "@/components/site/admin/event-form-dialog";
import { deleteEvent } from "@/lib/admin-actions";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Events</h1>
        <EventFormDialog trigger={<Button className="rounded-full">+ Add Event</Button>} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No events scheduled.
                </TableCell>
              </TableRow>
            )}
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Badge variant="outline">{event.registrations_count}</Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <EventFormDialog
                    event={event}
                    trigger={
                      <Button variant="outline" size="sm" className="rounded-full">
                        Edit
                      </Button>
                    }
                  />
                  <ActionButton
                    action={deleteEvent.bind(null, event.id)}
                    variant="destructive"
                    confirmMessage="Delete this event? This cannot be undone."
                    successMessage="Event deleted."
                  >
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
