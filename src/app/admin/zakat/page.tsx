import { Card, CardContent } from "@/components/ui/card";
import { ZakatSettingsForm } from "@/components/site/admin/zakat-settings-form";
import { getZakatSetting } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminZakatPage() {
  const setting = await getZakatSetting();

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">Zakat Settings</h1>
      <Card className="max-w-md">
        <CardContent>
          <ZakatSettingsForm currentNisab={setting.nisab_value} />
        </CardContent>
      </Card>
    </div>
  );
}
