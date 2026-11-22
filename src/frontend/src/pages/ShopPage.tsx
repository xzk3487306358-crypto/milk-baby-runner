import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { ShopCard } from "../components/shop/ShopCard";
import { ShopHeader } from "../components/shop/ShopHeader";
import { CHARACTERS, getSkinsForCharacter } from "../lib/characters";

const GRID = "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3";

function SectionTitle({
  children,
  hint,
}: { children: ReactNode; hint: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-2">
      <h2 className="text-sticker font-display text-2xl">{children}</h2>
      <span className="truncate text-xs font-bold text-muted-foreground">
        {hint}
      </span>
    </div>
  );
}

export default function ShopPage() {
  const naiwaSkins = getSkinsForCharacter("naiwa");
  const niulaiSkins = getSkinsForCharacter("niulai");

  return (
    <div data-ocid="shop.page" className="flex flex-col gap-6 py-2">
      <ShopHeader />

      <section
        data-ocid="shop.characters.section"
        aria-labelledby="shop-characters"
      >
        <SectionTitle hint="奶娃免费 · 牛来翻滚更快">
          <span id="shop-characters">角色</span>
        </SectionTitle>
        <div className={GRID}>
          {CHARACTERS.map((c, i) => (
            <ShopCard
              key={c.id}
              item={{ kind: "character", character: c }}
              index={i + 1}
              section="character"
            />
          ))}
        </div>
        <h3 className="mb-2 mt-4 font-display text-sm font-black text-muted-foreground">
          牛来皮肤
        </h3>
        <div className={GRID}>
          {niulaiSkins.map((s, i) => (
            <ShopCard
              key={s.id}
              item={{ kind: "skin", skin: s }}
              index={i + 1}
              section="niulai_skin"
            />
          ))}
        </div>
      </section>

      <section data-ocid="shop.skins.section" aria-labelledby="shop-skins">
        <SectionTitle hint={`共 ${naiwaSkins.length} 款`}>
          <span id="shop-skins">奶娃皮肤</span>
        </SectionTitle>
        <div className={GRID}>
          {naiwaSkins.map((s, i) => (
            <ShopCard
              key={s.id}
              item={{ kind: "skin", skin: s }}
              index={i + 1}
              section="naiwa_skin"
            />
          ))}
        </div>
      </section>

      <Link
        to="/"
        data-ocid="shop.back_menu.link"
        className="mx-auto flex min-h-11 items-center gap-1 rounded-full border-[3px] border-ink bg-gradient-primary px-8 py-3 font-display text-lg font-black text-primary-foreground shadow-sticker transition-all duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-1 active:shadow-sticker-pressed"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
        返回主菜单
      </Link>
    </div>
  );
}
