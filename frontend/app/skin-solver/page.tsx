"use client";
import fetchIrritantsCalculation, {
  IrritantsCalculationResponse,
} from "../(api)/solver/fetch-irritants-calculation";
import { useQuery } from "react-query";
import IrritantItem from "./irritant-item";
import { Button } from "../(ui)/button";
import { Ingredient, SkinType } from "../(api)/types";
import WithNav from "../with-nav";
import ProductSearch, {
  useProductSearchState,
} from "../(components)/product-search";

function ShowIrritants({ irritants }: { irritants: Ingredient[] }) {
  if (irritants.length === 0) {
    return <div>No irritants found</div>;
  }

  return (
    <div>
      <div>
        The following ingredients are present in more than one product and may
        be the cause of irritation:
      </div>
      <div className="flex flex-col divide-y">
        {irritants.map((irritant, key) => (
          <IrritantItem irritant={irritant} key={key} />
        ))}
      </div>
    </div>
  );
}

export default function SkinSolverPage() {
  const productSelectState = useProductSearchState();

  const { data, refetch, isRefetching, isLoading } =
    useQuery<IrritantsCalculationResponse>("irritants", fetch, {
      // refetchOnReconnect: false,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,
      enabled: false,
    });

  async function fetch(): Promise<IrritantsCalculationResponse> {
    return fetchIrritantsCalculation(
      SkinType.NORMAL,
      productSelectState.selected,
      []
    );
  }

  return (
    <WithNav>
      <div>Skin solver</div>
      <ProductSearch {...productSelectState} />
      <Button
        onClick={() => refetch()}
        loading={isLoading || isRefetching}
        disabled={productSelectState.selected.length < 2}
      >
        Calculate
      </Button>
      {data ? (
        <ShowIrritants irritants={data.map((d) => d.ingredient)} />
      ) : null}
    </WithNav>
  );
}
