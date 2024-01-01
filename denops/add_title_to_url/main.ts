import { Denops } from "https://deno.land/x/denops_std@v5.2.0/mod.ts";
import {
  getline,
  setline,
} from "https://deno.land/x/denops_std@v5.2.0/function/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

async function getTitle(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (doc) {
      const titleElement = doc.querySelector("title");
      if (titleElement) {
        return titleElement.textContent || "";
      }
    }
  } catch (error) {
    console.error("Error fetching the title:", error);
  }
  return "";
}

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async addTitleToUrl(start: number, end: number): Promise<void> {
      const lines = await getline(denops, start, end);
      const replaced = await Promise.all(lines.map(async (url) => {
        const title = await getTitle(url);
        return `[${title}](${url})`;
      }));
      await setline(denops, start, replaced);
    },
  };
  await denops.cmd(
    'command! -range AddTitleToUrl call denops#request("add_title_to_url", "addTitleToUrl", [<line1>, <line2>])',
  );
}