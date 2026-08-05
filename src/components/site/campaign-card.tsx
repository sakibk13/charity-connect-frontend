import Link from "next/link";

import { CampaignProgress } from "@/components/site/campaign-progress";
import { resolveImageUrl } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

const SHOW_RAISED_SLUGS = new Set([
  "aqua-aid",
  "sustain-now",
  "building-hope",
  "bright-futures",
  "emergency-aid",
  "share-meals",
  "free-mobile-clinic",
]);

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const showProgress = SHOW_RAISED_SLUGS.has(campaign.slug);
  return (
    <div className="pt-card">
      <div className="pt-card-img-wrapper">
        {campaign.image_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolveImageUrl(campaign.image_key)} alt={campaign.title} className="pt-card-img" />
        ) : null}
        <span className="pt-card-badge">{campaign.category}</span>
      </div>
      <div className="pt-card-body">
        <h3 className="pt-card-title">{campaign.title}</h3>
        <p className="pt-card-description">{campaign.description}</p>
        <div
          className="pt-progress-container"
          style={{
            visibility: showProgress ? "visible" : "hidden",
            minHeight: showProgress ? undefined : "46px",
          }}
        >
          {showProgress && <CampaignProgress raised={campaign.raised} goal={campaign.goal} />}
        </div>
      </div>
      <div className="pt-card-footer pt-card-cta-row">
        <Link href={`/campaigns/${campaign.slug}#donate`} className="pt-btn pt-btn-primary pt-btn-pill">
          <i className="fa-solid fa-heart" /> Donate
        </Link>
        <Link href={`/campaigns/${campaign.slug}`} className="pt-btn pt-btn-outline pt-btn-pill">
          Learn More <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
    </div>
  );
}
