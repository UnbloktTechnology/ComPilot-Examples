import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { useMemo } from "react";
import { useIdentityId } from "@compilot/react-sdk";

export const useUsername = () => {
  const { data: identityId } = useIdentityId();

  const username = useMemo(() => {
    if (!identityId) return "";

    const nameFromSeed = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      seed: identityId,
    });

    return nameFromSeed;
  }, [identityId]);

  return username;
};
