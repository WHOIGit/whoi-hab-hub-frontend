import { useRef } from "react";
import { useSelector } from "react-redux";
// local
import { selectVisibleSpeciesIds } from "./habSpeciesSlice";

// The API only has to return the species that are selected, which keeps the
// responses small. Selecting a species that was not asked for needs new data,
// but clearing one does not, because what is already loaded still covers every
// species that stays selected.
//
// `filterKey` is the other request options rolled into one value, so a change
// to any of them fetches again no matter what the species selection is.
export default function useSpeciesFilterRequest(filterKey) {
  const speciesIds = useSelector(selectVisibleSpeciesIds);
  const lastRequest = useRef(null);
  const speciesParam = speciesIds.join(",");

  // call this from the fetch effect, it returns true when the API has to be
  // asked again and records what the next response will hold
  function claimFetch() {
    const lastFetched = lastRequest.current;
    const hasNewSpecies =
      !lastFetched ||
      speciesIds.some((id) => !lastFetched.speciesIds.includes(id));

    if (lastFetched && lastFetched.filterKey === filterKey && !hasNewSpecies) {
      return false;
    }

    lastRequest.current = { filterKey, speciesIds };
    return true;
  }

  return { speciesIds, speciesParam, claimFetch };
}
