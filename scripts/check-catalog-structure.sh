#!/bin/bash

echo "Checking Catalog Module Structure..."
echo ""

check_dir() {
    if [ -d "$1" ]; then
        echo "[OK] $1"
    else
        echo "[MISSING] $1"
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo "[OK] $1"
    else
        echo "[MISSING] $1"
    fi
}

echo "=== Directories ==="
check_dir "src/modules/catalog"
check_dir "src/modules/catalog/schemas"
check_dir "src/modules/catalog/repositories"
check_dir "src/modules/catalog/services"
check_dir "src/modules/catalog/events"
check_dir "docs/catalog"

echo ""
echo "=== Schemas ==="
check_file "src/modules/catalog/schemas/work.schema.ts"
check_file "src/modules/catalog/schemas/source.schema.ts"
check_file "src/modules/catalog/schemas/translator.schema.ts"
check_file "src/modules/catalog/schemas/chapter.schema.ts"
check_file "src/modules/catalog/schemas/metadata.schema.ts"
check_file "src/modules/catalog/schemas/dto.schema.ts"
check_file "src/modules/catalog/schemas/external.schema.ts"
check_file "src/modules/catalog/schemas/mappers.ts"

echo ""
echo "=== Repositories ==="
check_file "src/modules/catalog/repositories/work.repository.interface.ts"
check_file "src/modules/catalog/repositories/source.repository.interface.ts"
check_file "src/modules/catalog/repositories/metadata.repository.interface.ts"
check_file "src/modules/catalog/repositories/chapter.repository.interface.ts"

echo ""
echo "=== Services ==="
check_file "src/modules/catalog/services/work.service.ts"
check_file "src/modules/catalog/services/aggregator.service.ts"
check_file "src/modules/catalog/services/shikimori.adapter.ts"

echo ""
echo "=== Events ==="
check_file "src/modules/catalog/events/types.ts"
check_file "src/modules/catalog/events/event-bus.interface.ts"
check_file "src/modules/catalog/events/event-publisher.ts"
check_file "src/modules/catalog/events/in-memory-event-bus.ts"

echo ""
echo "=== Documentation ==="
check_file "docs/catalog/USER_STORIES.md"
check_file "docs/catalog/USE_CASES.md"
check_file "docs/catalog/ARCHITECTURE.md"
check_file "docs/catalog/SHIKIMORI_INTEGRATION.md"
check_file "docs/catalog/MODULE_SUMMARY.md"
check_file "src/modules/catalog/README.md"

echo ""
echo "Done!"

