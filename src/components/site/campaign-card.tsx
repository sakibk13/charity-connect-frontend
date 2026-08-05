import Link from "next/link";

import { CampaignProgress } from "@/components/site/campaign-progress";
import type { Campaign } from "@/lib/types";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="pt-card">
      <div className="pt-card-img-wrapper">
        {campaign.image_key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={campaign.image_key} alt={campaign.title} className="pt-card-img" />
        ) : null}
        <span className="pt-card-badge">{campaign.category}</span>
      </div>
      <div className="pt-card-body">
        <h3 className="pt-card-title">{campaign.title}</h3>
        <p className="pt-card-description">{campaign.description}</p>
        <div className="pt-progress-container">
          <CampaignProgress raised={campaign.raised} goal={campaign.goal} />
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
