import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useLang } from "@/i18n/LanguageProvider";
import { Home } from "@/pages/Home";
import { Planets } from "@/pages/Planets";
import { PlanetDetail } from "@/pages/PlanetDetail";
import { Timeline } from "@/pages/Timeline";
import { NotFound } from "@/pages/NotFound";

/** Route changes should land at the top of the new page, not mid-scroll. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  const { t } = useLang();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      {/* Target of the skip link in Navbar. tabIndex -1 so focus can land here. */}
      <main id="main" tabIndex={-1} className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="/planets/:slug" element={<PlanetDetail />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t border-hairline px-4 py-10 text-center text-sm text-ink-muted">
        <p>{t("footer.sources")}</p>
        {/* Planet surfaces (continents, Martian features, the Great Red Spot)
            are generated from real coordinates in code — no external image is
            used, so no attribution is owed for them. */}
      </footer>
    </>
  );
}
