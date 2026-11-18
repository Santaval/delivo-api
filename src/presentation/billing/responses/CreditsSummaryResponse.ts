export default interface CreditsSummaryResponse {
  balance: number;
  overdraftFloor: number;
  lowBalanceThreshold: number;
  packs: { productId: string; credits: number }[];
}
