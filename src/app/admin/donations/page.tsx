import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAccessToken } from "@/lib/auth";
import { getAdminDonations, getCampaigns } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = {
  pending: "outline",
  completed: "default",
  failed: "destructive",
} as const;

function formatDollars(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default async function AdminDonationsPage() {
  const token = (await getAccessToken())!;
  const [donations, campaigns] = await Promise.all([getAdminDonations(token), getCampaigns()]);
  const campaignTitle = (id: string | null) =>
    id ? (campaigns.find((c) => c.id === id)?.title ?? "Deleted campaign") : "Processing fee";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Donations</h1>
        <p className="text-sm text-muted-foreground">
          All donations captured through Stripe Checkout, including recurring monthly renewals.
        </p>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No donations yet.
                </TableCell>
              </TableRow>
            )}
            {donations.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <div className="font-medium">{d.donor_name}</div>
                  <div className="text-sm text-muted-foreground">{d.donor_email}</div>
                </TableCell>
                <TableCell>{campaignTitle(d.campaign_id)}</TableCell>
                <TableCell className="font-medium">{formatDollars(d.amount_cents)}</TableCell>
                <TableCell className="capitalize">{d.frequency.replace("_", " ")}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[d.status]}>{d.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(d.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
