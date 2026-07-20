import { ProductResponse } from "@/presentation/products/responses/ProductResponse";

export default interface RouteLoadDetail {
  itemsCountByType: ItemCount[];
}

type ItemCount = {
  item: ProductResponse;
  count: number;
};
