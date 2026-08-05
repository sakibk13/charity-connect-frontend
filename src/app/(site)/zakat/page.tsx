import { ZakatCalculator } from "@/components/site/zakat-calculator";
import { getZakatSetting } from "@/lib/data";

export const metadata = { title: "Zakat Calculator | AICT Global Bangladesh" };
export const dynamic = "force-dynamic";

export default async function ZakatPage() {
  const setting = await getZakatSetting();

  return (
    <>
      <section className="zakat-hero">
        <div className="pt-container">
          <div className="zakat-hero-badge">
            <i className="fa-solid fa-moon" /> Islamic Finance Tool
          </div>
          <h1>Zakat Calculator</h1>
          <p>
            Calculate your obligatory Zakat with precision. Zakat purifies your wealth and is one
            of the five pillars of Islam — a duty upon every eligible Muslim.
          </p>
        </div>
      </section>

      <div className="pt-container">
        <ZakatCalculator nisab={setting.nisab_value} />
      </div>

      <div className="pt-container zakat-edu-section">
        <div className="zakat-edu-title">
          <h2>Understanding Zakat</h2>
          <p>Essential knowledge about this pillar of Islam</p>
        </div>
        <div className="zakat-edu-grid">
          <div className="zakat-edu-card">
            <div className="zakat-edu-card-icon" style={{ background: "rgba(34,197,94,.1)", color: "#22c55e" }}>
              <i className="fa-solid fa-heart" />
            </div>
            <h4>What is Zakat?</h4>
            <p>
              Zakat is the third pillar of Islam — a mandatory act of worship requiring eligible
              Muslims to donate 2.5% of their qualifying wealth annually. It purifies one&apos;s
              earnings, promotes social equity, and helps alleviate poverty in the community.
            </p>
          </div>
          <div className="zakat-edu-card">
            <div className="zakat-edu-card-icon" style={{ background: "rgba(99,102,241,.1)", color: "#6366f1" }}>
              <i className="fa-solid fa-user-check" />
            </div>
            <h4>Who Must Pay?</h4>
            <p>
              Zakat is obligatory on every sane, adult Muslim whose net zakatable wealth meets or
              exceeds the Nisab threshold for a full lunar year. Both men and women who meet the
              criteria are required to fulfill this duty.
            </p>
          </div>
          <div className="zakat-edu-card">
            <div className="zakat-edu-card-icon" style={{ background: "rgba(245,158,11,.1)", color: "#f59e0b" }}>
              <i className="fa-solid fa-scale-balanced" />
            </div>
            <h4>Nisab Explained</h4>
            <p>
              Nisab is the minimum amount of wealth a Muslim must possess before Zakat becomes
              obligatory. It is traditionally measured as the value of 87.48 grams of gold or
              612.36 grams of silver — whichever is lower — to benefit more recipients.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
