import { useEffect, useState } from "react";
import { database } from "../../infrastructure/db/Database";

export function useDatabaseInit() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setup() {
      await database.init();
      setIsReady(true);
    }
    setup();
  }, []);

  return isReady;
}
