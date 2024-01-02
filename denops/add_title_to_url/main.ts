import { Denops } from "https://deno.land/x/denops_std@v5.2.0/mod.ts";
import {
  col,
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
      const startCol = await col(denops, "'<") - 1;
      const endCol = await col(denops, "'>") - 1;
      const lines = await getline(denops, start, end);
      const replaced = await Promise.all(lines.map(async (line) => {
        const url = line.slice(startCol, endCol + 1);
        const title = await getTitle(url);
        return line.slice(0, startCol) + `[${title}](${url})` +
          line.slice(endCol + 1);
      }));
      await setline(denops, start, replaced);
    },
  };
  await denops.cmd(
    'command! -range AddTitleToUrl call denops#request("add_title_to_url", "addTitleToUrl", [<line1>, <line2>])',
  );
}
