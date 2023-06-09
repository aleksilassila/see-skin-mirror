"use client";
import { IrritantsCalculationResponse } from "../../../(api)/solver/fetch-irritants-calculation";
import { UseQueryResult } from "react-query";
import { useProductSelectPanelState } from "./product-select-panel";
import { useUser } from "../../../user";
import { GoogleLoginButton } from "../../../(navigation)/account-button";
import { Tab } from "@headlessui/react";
import { Ingredient, Product, SkinType } from "../../../(api)/api-types";
import { useFetchApi } from "../../../(api)/api";
import { PutSkinProfile } from "../../../(api)/api-routes";

export function useResultsPanelState(
  skinType: SkinType,
  selectedProducts: Product[],
  selectedIngredients: Ingredient[],
  enabled: boolean
) {
  const resultsQuery = useFetchApi<PutSkinProfile>(
    "/skin-profile",
    {
      params: {
        skinType,
        ingredientIds: selectedIngredients.map((i) => i.id),
        productIds: selectedProducts.map((p) => p.id),
      },
      data: {
        skinType,
        ingredientIds: selectedIngredients.map((i) => i.id),
        productIds: selectedProducts.map((p) => p.id),
      },
      method: "PUT",
    },
    {
      enabled,
    }
  );

  function updateUserIrritants() {
    if (!resultsQuery.data) return;
    // return updateUser({
    //   skinType,
    //   irritativeProductIds: selectedProducts.map((p) => p.id),
    //   irritativeIngredientIds: selectedIngredients.map((i) => i.id),
    //   irritantIds: resultsQuery.data.duplicates.map((d) => d.ingredient.id),
    //   irritativeClasses: [
    //     ...new Set(
    //       resultsQuery.data.skinTypeIrritants.flatMap(
    //         (s) => s.ingredientClasses
    //       )
    //     ),
    //   ],
    // });
  }

  return {
    resultsQuery,
    refetchResults: () => resultsQuery.refetch(),
    updateUserIrritants,
  };
}

interface Props {
  productSelectState: ReturnType<typeof useProductSelectPanelState>;
  useQueryResult: UseQueryResult<IrritantsCalculationResponse>;
}

export default function IrritantResultsPanel(
  state: ReturnType<typeof useResultsPanelState>
) {
  const { data, isLoading, isError } = state.resultsQuery;
  const user = useUser();

  if (!user.isSignedIn) {
    return <Tab.Panel>Please log in to get the results</Tab.Panel>;
  }

  if (isError || !data) {
    return <Tab.Panel>Could not fetch irritants.</Tab.Panel>;
  }

  if (isLoading) {
    return <Tab.Panel>Loading...</Tab.Panel>;
  }

  // const results =
  //   data.length === 0 ? (
  //     <div>Did not find irritants. Nice</div>
  //   ) : (
  //     data.map((irritant, key) => (
  //       <div key={key}>
  //         <div className="font-medium">{irritant.ingredient.name}</div>
  //         This ingredient may be an irritant for the following reasons:
  //         {irritant.irritationReasons.map((reason, key) => (
  //           <div key={key}>{reason.type}</div>
  //         ))}
  //       </div>
  //     ))
  //   );
  // @ts-ignore
  return (
    <Tab.Panel>
      {/*{results}*/}
      {/*@ts-ignore*/}
      {user.user === false && (
        <div>
          <div>
            Log in to browse skin products that are compatible with your skin!
          </div>
          <GoogleLoginButton />
        </div>
      )}
    </Tab.Panel>
  );
}
