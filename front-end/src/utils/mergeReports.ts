import { FirstCategory, PeerReport } from '@/types/report';

export function mergeReports(myCategories: FirstCategory[], peerCategories: FirstCategory[]): PeerReport[] {
  const peerMap = new Map<number, FirstCategory>(
    peerCategories.map((category) => [category.firstCategoryId, category])
  );

  return myCategories.map((category) => {
    const peerCategory = peerMap.get(category.firstCategoryId);

    return {
      name: category.displayName,
      amount: category.amount,
      peerAmount: peerCategory?.amount ?? 0,
    };
  });
}
