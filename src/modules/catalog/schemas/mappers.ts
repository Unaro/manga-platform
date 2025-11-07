import type { ShikimoriManga } from "./external.schema";
import type { ExternalWorkData } from "./external.schema";
import type { WorkType, WorkStatus } from "./work.schema";

/**
 * Маппинг типа произведения Shikimori -> наша система
 */
export function mapShikimoriKindToWorkType(kind: string): WorkType {
  const mapping: Record<string, WorkType> = {
    "manga": "manga",
    "manhwa": "manhwa",
    "manhua": "manhua",
    "one_shot": "manga",
    "doujin": "manga",
    "novel": "manga",
    "light_novel": "manga"
  };
  return mapping[kind] || "manga";
}

/**
 * Маппинг статуса произведения Shikimori -> наша система
 */
export function mapShikimoriStatusToWorkStatus(status: string): WorkStatus {
  const mapping: Record<string, WorkStatus> = {
    "anons": "upcoming",
    "ongoing": "ongoing",
    "released": "completed",
    "paused": "hiatus",
    "discontinued": "cancelled"
  };
  return mapping[status] || "ongoing";
}

/**
 * Получить теги на основе типа произведения Shikimori
 */
export function getTagsFromShikimoriKind(kind: string): string[] {
  const tags: string[] = [];
  
  if (kind === "one_shot") {
    tags.push("one-shot");
  } else if (kind === "doujin") {
    tags.push("doujin");
  } else if (kind === "novel") {
    tags.push("novel");
  } else if (kind === "light_novel") {
    tags.push("light-novel");
  }
  
  return tags;
}

/**
 * Очистить HTML из описания
 */
export function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  
  // Простая очистка HTML тегов
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/**
 * Подсчитать общее количество оценок из статистики
 */
export function calculateRatingCountFromStats(
  scoresStats: Array<{ score: number; count: number }> | undefined
): number | null {
  if (!scoresStats || scoresStats.length === 0) {
    return null;
  }
  
  return scoresStats.reduce((total, stat) => total + stat.count, 0);
}

/**
 * Маппинг полного объекта Shikimori Manga -> ExternalWorkData
 */
export function mapShikimoriMangaToExternalWorkData(
  manga: ShikimoriManga,
  sourceBaseUrl: string
): ExternalWorkData {
  const title = manga.russian || manga.name;
  const coverUrl = manga.poster?.originalUrl || manga.poster?.mainUrl || null;
  const externalUrl = `${sourceBaseUrl}${manga.url}`;
  
  // Жанры (предпочитаем русские названия)
  const genres = manga.genres?.map(g => g.russian || g.name) || [];
  
  // Авторы (из publishers, так как authors может быть недоступно)
  const authors = manga.publishers?.map(p => p.name) || [];
  
  // Теги на основе kind
  const tags = getTagsFromShikimoriKind(manga.kind);
  
  // Количество оценок из статистики
  const externalRatingCount = calculateRatingCountFromStats(manga.scoresStats);
  
  return {
    externalId: manga.id,
    title,
    alternativeTitles: {
      english: manga.english || null,
      romaji: manga.name,
      native: manga.japanese || null
    },
    type: mapShikimoriKindToWorkType(manga.kind),
    status: mapShikimoriStatusToWorkStatus(manga.status),
    description: stripHtml(manga.description),
    coverUrl,
    externalUrl,
    externalRating: manga.score,
    externalRatingCount,
    genres,
    authors,
    tags,
    metadata: {
      chapters: manga.chapters,
      volumes: manga.volumes,
      airedOn: manga.airedOn || null,
      releasedOn: manga.releasedOn || null,
      franchise: manga.franchise || null,
      publishers: manga.publishers,
      externalLinks: manga.externalLinks,
      scoresStats: manga.scoresStats,
      statusesStats: manga.statusesStats
    }
  };
}

