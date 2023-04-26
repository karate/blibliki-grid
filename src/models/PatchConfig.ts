import { ModuleProps } from "components/AudioModule/modulesSlice";
import { ExtendedLayout } from "Grid/layoutsSlice";
import { RouteProps } from "Routes/routesSlice";

import db from "./db";

export interface IPatchConfig {
  id?: number;
  patchId: number;
  config: IConfig;
}

export interface IConfig {
  modules: ModuleProps[];
  routes: RouteProps[];
  layouts: ExtendedLayout[];
}

export default class PatchConfig implements IPatchConfig {
  id?: number;
  patchId: number;
  config: IConfig;

  static async findByPatchId(patchId: number) {
    const patchConfig = await db.patchConfigs
      .where("patchId")
      .equals(patchId)
      .first();

    if (!patchConfig) throw Error("PatchConfig not found");

    return patchConfig;
  }

  constructor(props: { id?: number; patchId: number; config?: IConfig }) {
    Object.assign(this, props);
  }

  async save() {
    return await db.transaction("rw", db.patchConfigs, async () => {
      this.id = await db.patchConfigs.put(this);
    });
  }

  async delete() {}
}