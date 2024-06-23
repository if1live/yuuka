import type { Account, Preset } from "@yuuka/api";
import { type PropsWithChildren, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { LocalDatabase } from "../db.js";

// 계정과목은 자주 안바뀌니까 전역 상태로 때려박자.
// async/await에 끌려들어갈 범위를 줄이는게 목적
export interface MasterDataRoot {
  accounts: Account[];
  presets: Preset[];
}

const initialValue: MasterDataRoot = {
  accounts: [],
  presets: [],
};

type MasterDataValue = MasterDataRoot & {
  synchronize: (root: MasterDataRoot) => void;
};

const MasterDataContext = createContext<MasterDataValue | undefined>(undefined);

export const MasterDataProvider = (props: PropsWithChildren) => {
  const [data, setData] = useState<MasterDataRoot>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    LocalDatabase.load()
      .then((db) => {
        setData(db);
        setLoading(false);
      })
      .catch((e) => {
        setError(e as Error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error: {error.message}</div>;
  }

  const value: MasterDataValue = {
    ...data,
    synchronize: (root) => {
      setData(root);
      LocalDatabase.synchronize(root);
    },
  };

  return (
    <MasterDataContext.Provider value={value}>
      {props.children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const value = useContext(MasterDataContext);
  if (value === undefined) {
    throw new Error("useMasterData must be used within a MasterDataProvider");
  }
  return value;
};
