"use client";

import { useState } from "react";
import { useSources } from "@/modules/catalog/hooks/admin";
import { useTestAdapter, useImportWork } from "@/modules/catalog/hooks/admin";
import { useAdminUIStore } from "@/stores/admin-ui.store";

export default function ImportPage() {
  const [selectedSource, setSelectedSource] = useState("");
  const [testQuery, setTestQuery] = useState("наруто");
  const [importId, setImportId] = useState("");

  const { data: sourcesData } = useSources();
  const testAdapter = useTestAdapter();
  const importWork = useImportWork();
  
  const addNotification = useAdminUIStore((state) => state.addNotification);

  const handleTest = async () => {
    if (!selectedSource) return;
    try {
      const result = await testAdapter.mutateAsync({ 
        sourceId: selectedSource, 
        query: testQuery 
      });
      addNotification({
        type: "success",
        message: `Найдено ${result.results.length} результатов`
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Ошибка тестирования адаптера"
      });
    }
  };

  const handleImport = async () => {
    if (!selectedSource || !importId) return;
    try {
      await importWork.mutateAsync({ 
        sourceId: selectedSource, 
        externalId: importId 
      });
      addNotification({
        type: "success",
        message: "Работа успешно импортирована!"
      });
      setImportId("");
    } catch (error: any) {
      addNotification({
        type: "error",
        message: error.message || "Ошибка импорта"
      });
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Import from External Sources
      </h1>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          1. Select Source
        </h2>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="">-- Select Source --</option>
          {sourcesData?.sources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSource && (
        <>
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              2. Test Adapter Connection
            </h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Query
              </label>
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Enter search query"
              />
            </div>
            <button
              onClick={handleTest}
              disabled={testAdapter.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {testAdapter.isPending ? "Testing..." : "Test Connection"}
            </button>

            {testAdapter.data && (
              <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="mb-2 font-medium text-green-800 dark:text-green-400">
                  ✓ Connection successful!
                </p>
                <div className="space-y-2">
                  {testAdapter.data.results.map((result: any) => (
                    <div key={result.id} className="rounded border border-green-200 bg-white p-2 text-sm dark:border-green-800 dark:bg-gray-900">
                      <p className="font-medium text-gray-900 dark:text-white">{result.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        ID: {result.id} | Type: {result.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              3. Import Work
            </h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                External ID
              </label>
              <input
                type="text"
                value={importId}
                onChange={(e) => setImportId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Enter external ID"
              />
            </div>
            <button
              onClick={handleImport}
              disabled={importWork.isPending || !importId}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {importWork.isPending ? "Importing..." : "Import Work"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
