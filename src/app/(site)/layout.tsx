import { BasketDrawer } from "@/components/site/basket-drawer";
import { BasketProvider } from "@/components/site/basket-context";
import { CurrencyProvider } from "@/components/site/currency-context";
import { FloatingDonateButton } from "@/components/site/floating-donate-button";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ThemeInit } from "@/components/site/theme-init";
import { ToastProvider } from "@/components/site/toast-provider";
import { WhatsappButton } from "@/components/site/whatsapp-button";
import { getCampaigns } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const campaigns = await getCampaigns();

  return (
    <ToastProvider>
      <CurrencyProvider>
        <BasketProvider>
          <div className="pt-root">
            <ThemeInit />
            <SiteHeader campaigns={campaigns.slice(0, 6)} />
            <main className="pt-app-content">{children}</main>
            <SiteFooter />
            <FloatingDonateButton />
            <WhatsappButton />
            <BasketDrawer />
          </div>
        </BasketProvider>
      </CurrencyProvider>
    </ToastProvider>
  );
}
