import type { ISourceAdapter } from "./aggregator.service";
import type { ShikimoriManga, ExternalWorkData, ExternalChapterData } from "../schemas/external.schema";
import { ShikimoriMangaListResponseSchema } from "../schemas/external.schema";
import { mapShikimoriMangaToExternalWorkData } from "../schemas/mappers";

export interface ShikimoriAdapterConfig {
  baseUrl: string;
  graphqlUrl: string;
  appName: string;
  rateLimitRps?: number;
  rateLimitRpm?: number;
}

class RateLimiter {
  private requestsThisSecond: number = 0;
  private requestsThisMinute: number = 0;
  private lastSecondReset: number = Date.now();
  private lastMinuteReset: number = Date.now();

  constructor(
    private maxRps: number = 5,
    private maxRpm: number = 90
  ) {}

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();

    if (now - this.lastSecondReset >= 1000) {
      this.requestsThisSecond = 0;
      this.lastSecondReset = now;
    }

    if (now - this.lastMinuteReset >= 60000) {
      this.requestsThisMinute = 0;
      this.lastMinuteReset = now;
    }

    if (this.requestsThisSecond >= this.maxRps) {
      await this.sleep(1000 - (now - this.lastSecondReset));
    }

    if (this.requestsThisMinute >= this.maxRpm) {
      await this.sleep(60000 - (now - this.lastMinuteReset));
    }

    this.requestsThisSecond++;
    this.requestsThisMinute++;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class ShikimoriAdapter implements ISourceAdapter {
  private rateLimiter: RateLimiter;

  constructor(private config: ShikimoriAdapterConfig) {
    this.rateLimiter = new RateLimiter(
      config.rateLimitRps || 4,
      config.rateLimitRpm || 80
    );
  }

  async fetchWork(externalId: string): Promise<ExternalWorkData> {
    const manga = await this.fetchMangaGraphQL(externalId);
    return mapShikimoriMangaToExternalWorkData(manga, this.config.baseUrl);
  }

  async fetchChapters(externalId: string): Promise<ExternalChapterData[]> {
    return [];
  }

  async search(query: string): Promise<ExternalWorkData[]> {
    const mangas = await this.searchMangasGraphQL(query);
    return mangas.map(manga => 
      mapShikimoriMangaToExternalWorkData(manga, this.config.baseUrl)
    );
  }

  private async fetchMangaGraphQL(id: string): Promise<ShikimoriManga> {
    await this.rateLimiter.waitIfNeeded();

    const query = `
      query GetManga($ids: String) {
        mangas(ids: $ids, limit: 1) {
          id
          name
          russian
          english
          japanese
          kind
          status
          score
          chapters
          volumes
          description
          airedOn { year month day }
          releasedOn { year month day }
          poster { originalUrl mainUrl }
          url
          genres { id name russian kind }
          publishers { id name }
          franchise
          externalLinks { id kind url source }
          scoresStats { score count }
          statusesStats { status count }
        }
      }
    `;

    const response = await fetch(this.config.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": this.config.appName
      },
      body: JSON.stringify({
        query,
        variables: { ids: id }
      })
    });

    if (!response.ok) {
      throw new Error(`Shikimori API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const parsed = ShikimoriMangaListResponseSchema.parse(result);

    const manga = parsed.data.mangas[0];
    if (!manga) {
      throw new Error(`Manga with ID ${id} not found on Shikimori`);
    }

    return manga;
  }

  private async searchMangasGraphQL(query: string): Promise<ShikimoriManga[]> {
    await this.rateLimiter.waitIfNeeded();

    const graphqlQuery = `
      query SearchMangas($search: String, $limit: PositiveInt) {
        mangas(search: $search, limit: $limit) {
          id
          name
          russian
          english
          japanese
          kind
          status
          score
          poster { originalUrl mainUrl }
          url
          genres { name russian }
        }
      }
    `;

    const response = await fetch(this.config.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": this.config.appName
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: query, limit: 20 }
      })
    });

    if (!response.ok) {
      throw new Error(`Shikimori API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const parsed = ShikimoriMangaListResponseSchema.parse(result);

    return parsed.data.mangas;
  }
}

