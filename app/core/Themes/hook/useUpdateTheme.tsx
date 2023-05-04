import { useEffect } from "react";
import { applyTheme } from "~/core/Themes/Utils/utils";

export const useUpdateTheme = () => {
  useEffect(() => {
    typeof window !== "undefined" && applyTheme();
  }, []);
};
