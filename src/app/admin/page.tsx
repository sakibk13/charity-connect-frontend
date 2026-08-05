import { Banknote, CalendarDays, Megaphone, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignFundingMeters } from "@/components/site/admin/campaign-funding-meters";
import { CampaignsByCategoryChart } from "@/components/site/admin/campaigns-by-category-chart";
import { getAccessToken } from "@/lib/auth";
import { getAdminCampaigns, getEvents, getVolunteers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const token = (await getAccessToken())!;
  const [campaigns, events, pendingVolunteers] = await Promise.all([
    getAdminCampaigns(token),
    getEvents(),
    getVolunteers(token, "pending"),
  ]);

  const activeCampaigns = campaigns.filter((c) => c.active);
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);

  const stats = [
    { label: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: Banknote },
    { label: "Active Campaigns", value: activeCampaigns.length, icon: Megaphone },
    { label: "Pending Volunteers", value: pendingVolunteers.length, icon: Users },
    { label: "Upcoming Events", value: events.length, icon: CalendarDays },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Overview</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Campaign Funding Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {activeCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active campaigns yet.</p>
            ) : (
              <CampaignFundingMeters campaigns={activeCampaigns} />
            )}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Campaigns by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No campaigns yet.</p>
            ) : (
              <CampaignsByCategoryChart campaigns={campaigns} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
