export type InventoryStats = {
  totalSku: number;
  totalSkuFormatted: string;
  totalQty: number;
  reserved: number;
  available: number;
  readyRatio: number;
  readyRatioFormatted: string;
  depots: Array<{ depotId: string; totalQty: number; reserved: number; skus: number }>;
  updatedAt: string;
};

export function useInventoryStats() {
  const stats = ref<InventoryStats | null>(null);
  const pending = ref(false);
  const error = ref<string | null>(null);

  async function refresh() {
    pending.value = true;
    error.value = null;
    try {
      const res = await $fetch<InventoryStats>("/api/inventory/stats");
      stats.value = res;
      return res;
    } catch (e: any) {
      error.value = e?.data?.message ?? e?.message ?? "Gagal memuat stats";
      return null;
    } finally {
      pending.value = false;
    }
  }

  // auto-fetch on client, SSR can await refresh() manually
  if (import.meta.client) refresh();

  const totalSkuFormatted = computed(() => stats.value?.totalSkuFormatted ?? "—");
  const readyRatioFormatted = computed(() => stats.value?.readyRatioFormatted ?? "—");

  return { stats, pending, error, refresh, totalSkuFormatted, readyRatioFormatted };
}
