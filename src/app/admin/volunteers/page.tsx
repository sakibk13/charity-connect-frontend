import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/site/admin/action-button";
import { setVolunteerStatus } from "@/lib/admin-actions";
import { getAccessToken } from "@/lib/auth";
import { getVolunteers } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = {
  pending: "outline",
  approved: "default",
  rejected: "secondary",
} as const;

export default async function AdminVolunteersPage() {
  const token = (await getAccessToken())!;
  const volunteers = await getVolunteers(token);

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Volunteer Applications</h1>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No volunteer applications yet.
                </TableCell>
              </TableRow>
            )}
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer.id}>
                <TableCell className="font-medium">{volunteer.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {volunteer.email}
                  <br />
                  {volunteer.phone}
                </TableCell>
                <TableCell className="max-w-64 truncate text-sm text-muted-foreground">
                  {volunteer.skills}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[volunteer.status]}>{volunteer.status}</Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  {volunteer.status === "pending" ? (
                    <>
                      <ActionButton
                        action={setVolunteerStatus.bind(null, volunteer.id, "approved")}
                        successMessage="Volunteer approved."
                      >
                        Approve
                      </ActionButton>
                      <ActionButton
                        action={setVolunteerStatus.bind(null, volunteer.id, "rejected")}
                        variant="destructive"
                        successMessage="Volunteer rejected."
                      >
                        Reject
                      </ActionButton>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">No actions</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
