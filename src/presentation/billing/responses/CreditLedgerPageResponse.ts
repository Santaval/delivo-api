import CreditLedgerEntryResponse from "./CreditLedgerEntryResponse";

/** Same pagination shape as `BillsPageResponse`, without `counts`. */
export default interface CreditLedgerPageResponse {
  data: CreditLedgerEntryResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
