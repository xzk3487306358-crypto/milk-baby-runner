// Generated from tests/e2e/specs/play-caught-and-submit.json (spec 45fe27bf4023ba89). Edit the spec, not this file.
import { test } from "@e2e-dev/web";
import type { Locator, Screen } from "e2e";
import { expect } from "e2e";

/** Steps this flow's recording found already done; strict replay skips them, as they have nothing to replay. */
const skippedSteps: readonly number[] = JSON.parse(process.env.CAFFEINE_E2E_SKIP_STEPS ?? "[]");

const recording = process.env.CAFFEINE_E2E_MODE === "record" || process.env.CAFFEINE_E2E_MODE === "heal";

/** Whether `holds` turns true within the assertion timeout. */
async function eventually(holds: () => Promise<boolean>): Promise<boolean> {
  const deadline = Date.now() + 5000;
  for (;;) {
    if (await holds()) return true;
    if (Date.now() >= deadline) return false;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

function flowChecks() {
  let failed = 0;
  return {
    /** Spec check `index`: a failure fails a strict replay at once and is kept otherwise. */
    async check(index: number, verify: () => Promise<void>, holds: () => Promise<boolean>): Promise<void> {
      if (!recording) return verify();
      if (failed === 0) {
        try {
          return await verify();
        } catch (error) {
          if ((error as { code?: unknown }).code !== "ASSERTION_FAILED") throw error;
        }
      } else if (await eventually(holds)) {
        return;
      }
      failed += 1;
      expect.soft(false, `check ${String(index)}`).toBe(true);
    },
  };
}

/** `text` as a case-insensitive pattern in which each run of spaces also matches none. */
function spacedText(text: string): RegExp {
  const words = text.trim().split(/\s+/).map((word) => word.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&"));
  return new RegExp(words.join("\\s*"), "i");
}

/** Words the screen shows: visible text, the placeholder of an input that shows it, or a field that holds it right after the step that typed it. */
async function shownText(screen: Screen, text: string, typed = false, pattern?: RegExp): Promise<Locator> {
  const asText = screen.getByText(pattern ?? spacedText(text), { visible: true }).first();
  const field = pattern === undefined ? { exact: false, visible: true } : { exact: true, visible: true };
  const asPlaceholder = screen.getByPlaceholder(text, field).first();
  const asValue = screen.getByDisplayValue(text, field).first();
  for (let waited = 0; waited < 5000; waited += 250) {
    if (await asText.isVisible()) return asText;
    if (await asPlaceholder.isVisible()) return asPlaceholder;
    if (typed && (await asValue.isVisible())) return asValue;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return asText;
}

/** `text` as an element's whole text, ignoring case and runs of spaces. */
function wholeText(text: string): RegExp {
  const words = text.trim().split(/\s+/).map((word) => word.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&"));
  return new RegExp(`^\\s*${words.join("\\s+")}\\s*$`, "i");
}

/** A control by its name as a button or a link: a link styled as a button (`<Button asChild><Link>`) is either. */
async function shownControl(screen: Screen, name: string): Promise<Locator> {
  const asButton = screen.getByRole("button", name, { exact: false }).first();
  const asLink = screen.getByRole("link", name, { exact: false }).first();
  for (let waited = 0; waited < 5000; waited += 250) {
    if (await asButton.isVisible()) return asButton;
    if (await asLink.isVisible()) return asLink;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return asButton;
}

test("play-caught-and-submit", async ({ app, agent, screen, browser }) => {
  const flow = flowChecks();
  await app.open("/");

  if (!skippedSteps.includes(0)) await agent.act("Press 跳过\nDo not do the next step yet: Press 开始游戏", { maxModelCalls: 20 });
  await flow.check(0, async () => { await expect(await shownText(screen, "开始游戏")).toBeVisible({ timeout: 15000 }); }, async () => (await shownText(screen, "开始游戏")).isVisible());

  if (!skippedSteps.includes(1)) await agent.act("Press 开始游戏\nDo not do the next step yet: Press 暂停", { maxModelCalls: 20 });
  await flow.check(1, async () => { await expect(browser).toHaveURL(new RegExp("^https?://[^/]+/play/?(?:[?#].*)?$")); }, async () => new RegExp("^https?://[^/]+/play/?(?:[?#].*)?$").test(await browser.url()));
  await flow.check(2, async () => { await expect(await shownControl(screen, "暂停")).toBeVisible(); }, async () => (await shownControl(screen, "暂停")).isVisible());

  if (!skippedSteps.includes(2)) await agent.act("Press 暂停\nDo not do the next step yet: Press 继续", { maxModelCalls: 20 });
  await flow.check(3, async () => { await expect(await shownControl(screen, "继续")).toBeVisible(); }, async () => (await shownControl(screen, "继续")).isVisible());
  await flow.check(4, async () => { await expect(await shownText(screen, "重新开始")).toBeVisible(); }, async () => (await shownText(screen, "重新开始")).isVisible());
  await flow.check(5, async () => { await expect(await shownText(screen, "返回主菜单")).toBeVisible(); }, async () => (await shownText(screen, "返回主菜单")).isVisible());

  if (!skippedSteps.includes(3)) await agent.act("Press 继续\nDo not do the next step yet: Let the kangaroo catch the runner by staying still in the starting lane without pressing any key until the results screen appears", { maxModelCalls: 20 });
  await flow.check(6, async () => { await expect(await shownControl(screen, "暂停")).toBeVisible(); }, async () => (await shownControl(screen, "暂停")).isVisible());

  if (!skippedSteps.includes(4)) await agent.act("Let the kangaroo catch the runner by staying still in the starting lane without pressing any key until the results screen appears\nDo not do the next step yet: Submit the score with nickname 测试奶家人 using 提交到排行榜", { maxModelCalls: 20 });
  await flow.check(7, async () => { await expect(await shownText(screen, "被袋鼠抓住了")).toBeVisible(); }, async () => (await shownText(screen, "被袋鼠抓住了")).isVisible());
  await flow.check(8, async () => { await expect(await shownText(screen, "最高连击")).toBeVisible(); }, async () => (await shownText(screen, "最高连击")).isVisible());
  await flow.check(9, async () => { await expect(await shownText(screen, "提交到排行榜")).toBeVisible(); }, async () => (await shownText(screen, "提交到排行榜")).isVisible());
  await flow.check(10, async () => { await expect(await shownText(screen, "再来一局")).toBeVisible(); }, async () => (await shownText(screen, "再来一局")).isVisible());

  if (!skippedSteps.includes(5)) await agent.act("Submit the score with nickname 测试奶家人 using 提交到排行榜\nDo not do the next step yet: Press 查看排行榜", { maxModelCalls: 20 });
  await flow.check(11, async () => { await expect(await shownText(screen, "提交成功")).toBeVisible(); }, async () => (await shownText(screen, "提交成功")).isVisible());
  await flow.check(12, async () => { await expect(await shownText(screen, "全球第")).toBeVisible(); }, async () => (await shownText(screen, "全球第")).isVisible());

  if (!skippedSteps.includes(6)) await agent.act("Press 查看排行榜", { maxModelCalls: 20 });
  await flow.check(13, async () => { await expect(await shownText(screen, "全球排行榜")).toBeVisible(); }, async () => (await shownText(screen, "全球排行榜")).isVisible());
  await flow.check(14, async () => { await expect(await shownText(screen, "测试奶家人")).toBeVisible(); }, async () => (await shownText(screen, "测试奶家人")).isVisible());
  await flow.check(15, async () => { await expect(screen.getByText(wholeText("你"), { visible: true })).toHaveCount(1); }, async () => (await screen.getByText(wholeText("你"), { visible: true }).count()) === 1);
});
