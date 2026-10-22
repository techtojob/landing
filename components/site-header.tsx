import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AnimatedButtonLabel } from "@/components/animated-button-label";
import { HeaderShell } from "@/components/header-shell";
import { DiscordMemberLink } from "@/components/discord-member-link";
import { AccountLink } from "@/components/account-link";
import { MobileMenu } from "@/components/mobile-menu";
import { MoreMenu } from "@/components/more-menu";
import { bolsa, site } from "@/lib/site";

// El menú de TechToJob: el MISMO en la landing y en la bolsa (techtojob.com/empleo, repo techtojob/platform:
// apps/web/src/components/sitio/nav-bolsa.tsx), para que se vea como una sola web.
// Ofertas, Talento y Proyectos son páginas de la bolsa; Torneos y lo de "Más", de la landing.
const navigation = [
  ["offers", bolsa.ofertas],
  ["talentSearch", bolsa.talento],
  ["projects", bolsa.proyectos],
  ["tournaments", "/torneos"],
] as const;
const more = [
  ["news", "/noticias"],
  ["forCompanies", "/empresas"],
  ["about", "/quienes-somos"],
] as const;

type Translate = Awaited<ReturnType<typeof getTranslations>>;

function Navigation({ t, current, mobile = false }: Readonly<{ t: Translate; current?: string; mobile?: boolean }>) {
  const items = mobile ? [...navigation, ...more] : navigation;
  return (
    <ul className={mobile ? "grid min-w-56 gap-1" : "flex items-center gap-6"}>
      {items.map(([key, href]) => {
        const active = current === href;
        return (
          <li key={key}>
            <a
              href={href}
              aria-current={active ? "page" : undefined}
              className={mobile
                ? `block rounded-xl px-4 py-3 text-base font-bold transition-colors hover:bg-white/8 hover:text-primary ${active ? "bg-white/8 text-primary" : ""}`
                : `text-sm font-bold transition-colors hover:text-primary ${active ? "text-primary" : ""}`}
            >
              {t(`navigation.${key}`)}
            </a>
          </li>
        );
      })}
      {!mobile && (
        <li>
          <MoreMenu label={t("navigation.menuMore")} current={current} items={more.map(([key, href]) => ({ href, label: t(`navigation.${key}`) }))} />
        </li>
      )}
    </ul>
  );
}

function DiscordAction({ t, className }: Readonly<{ t: Translate; className: string }>) {
  return (
    <DiscordMemberLink
      className={`group/action relative items-center gap-2 overflow-hidden rounded-full bg-primary px-4 text-sm font-bold text-ink ${className}`}
      label={t("community.joinFull", { count: "{count}" })}
      countLabel={t("community.members", { count: "{count}" })}
      animated
    >
      <Image src="/images/discord-dark.svg" alt="" width={20} height={20} />
    </DiscordMemberLink>
  );
}

export async function SiteHeader({ home = true, current }: Readonly<{ home?: boolean; current?: string }>) {
  const t = await getTranslations();

  return (
    <header className="sticky inset-x-0 top-0 z-50 px-[var(--page-gutter)]">
      <HeaderShell>
        <a href={home ? "#top" : "/"} className="flex w-fit items-center" aria-label={t("brand.name")}>
          <Image src="/images/brand-logo.svg" alt="" width={140} height={78} className="h-11 w-auto min-[50rem]:h-14" loading="eager" fetchPriority="high" />
        </a>
        <nav className="hidden min-[64rem]:block" aria-label={t("navigation.community")}>
          <Navigation t={t} current={current} />
        </nav>
        <DiscordAction t={t} className="inline-flex min-h-11 justify-self-center min-[64rem]:hidden" />
        <div className="flex items-center justify-end gap-2">
          <DiscordAction t={t} className="hidden min-h-11 min-[76rem]:inline-flex" />
          <AccountLink loginLabel={t("navigation.login")} accountLabel={t("navigation.account")} className="hidden min-h-11 min-[64rem]:inline-flex" />
          <MobileMenu label={t("navigation.menu")}>
            <nav aria-label={t("navigation.community")}>
              <Navigation t={t} current={current} mobile />
              <AccountLink loginLabel={t("navigation.login")} accountLabel={t("navigation.account")} className="mt-2 flex min-h-11 justify-center" />
              <a className="group/action relative mt-2 flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 font-bold text-ink" href={site.discord}>
                <Image src="/images/discord-dark.svg" alt="" width={20} height={20} />
                <AnimatedButtonLabel text={t("community.join")} />
              </a>
            </nav>
          </MobileMenu>
        </div>
      </HeaderShell>
    </header>
  );
}
