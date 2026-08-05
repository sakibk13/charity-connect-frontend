import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionButton } from "@/components/site/admin/action-button";
import { CampaignFormDialog } from "@/components/site/admin/campaign-form-dialog";
import { getAccessToken } from "@/lib/auth";
import { getAdminCampaigns } from "@/lib/data";
import { setCampaignActive } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const token = (await getAccessToken())!;
  const campaigns = await getAdminCampaigns(token);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Campaigns</h1>
        <CampaignFormDialog trigger={<Button className="rounded-full">+ New Campaign</Button>} />
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Raised / Goal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No campaigns yet.
                </TableCell>
              </TableRow>
            )}
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell>{campaign.category}</TableCell>
                <TableCell>
                  ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={campaign.active ? "default" : "secondary"}>
                    {campaign.active ? "Active" : "Deactivated"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <CampaignFormDialog
                    campaign={campaign}
                    trigger={
                      <Button variant="outline" size="sm" className="rounded-full">
                        Edit
                      </Button>
                    }
                  />
                  <ActionButton
                    action={setCampaignActive.bind(null, campaign.id, !campaign.active)}
                    variant={campaign.active ? "destructive" : "outline"}
                    successMessage={campaign.active ? "Campaign deactivated." : "Campaign reactivated."}
                  >
                    {campaign.active ? "Deactivate" : "Reactivate"}
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
