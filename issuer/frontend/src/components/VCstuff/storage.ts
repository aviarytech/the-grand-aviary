import { readFileSync, writeFileSync, existsSync } from "fs";
import { KMSStorage } from "@extrimian/kms-core";

export class FileSystemKMSSecureStorage implements KMSStorage {
  public readonly filepath: string;

  constructor(params: { filepath: string }) {
    this.filepath = params.filepath;
  }

  async add(key: string, data: unknown): Promise<void> {
    const map = this.getData();
    map.set(key, data);
    this.saveData(map);
  }

  async get(key: string): Promise<unknown> {
    return this.getData().get(key);
  }

  async getAll(): Promise<Map<string, unknown>> {
    return this.getData();
  }

  update(key: string, data: unknown) {
    const map = this.getData();
    map.set(key, data);
    this.saveData(map);
  }

  remove(key: string) {
    const map = this.getData();
    map.delete(key);
    this.saveData(map);
  }

  private getData(): Map<string, unknown> {
    if (!existsSync(this.filepath)) {
      return new Map();
    }

    const file = readFileSync(this.filepath, {
      encoding: "utf-8",
    });

    if (!file) {
      return new Map();
    }

    return new Map(Object.entries(JSON.parse(file)));
  }

  private saveData(data: Map<string, unknown>) {
    writeFileSync(this.filepath, JSON.stringify(Object.fromEntries(data)), {
      encoding: "utf-8",
    });
  }
}