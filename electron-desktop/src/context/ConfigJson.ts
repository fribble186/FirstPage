import { createContext } from "react";
import { domain } from "firstpage-core";

export type ConfigJsonContextType = {
  configJson: domain.ConfigJson | null;
  setConfigJson: React.Dispatch<React.SetStateAction<domain.ConfigJson | null>>;
} | null;

export const ConfigJsonContext = createContext(null as ConfigJsonContextType);
