# Catalog API Documentation

## Public Endpoints

### GET /api/catalog/works
List all works with pagination and filters.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `type` (enum: manga, manhwa, manhua)
- `status` (enum: upcoming, ongoing, completed, hiatus, cancelled)
- `sort` (enum: created_at, updated_at, title)
- `order` (enum: asc, desc)

**Example:**
curl "http://localhost:3000/api/catalog/works?page=1&limit=20&type=manga&status=ongoing"

text

### GET /api/catalog/works/[slug]
Get single work with full details.

**Example:**
curl "http://localhost:3000/api/catalog/works/one-piece"

text

### GET /api/catalog/works/[slug]/chapters
Get chapters for a work.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)
- `sourceId` (uuid, optional)
- `translatorId` (uuid, optional)

**Example:**
curl "http://localhost:3000/api/catalog/works/one-piece/chapters?page=1&limit=50"

text

### GET /api/catalog/sources
List all active sources.

**Example:**
curl "http://localhost:3000/api/catalog/sources"

text

### GET /api/catalog/genres
List all genres.

**Example:**
curl "http://localhost:3000/api/catalog/genres"

text

### GET /api/catalog/tags
List all tags.

**Example:**
curl "http://localhost:3000/api/catalog/tags"

text

## Testing

All endpoints available at `http://localhost:3000/api/catalog/*`

