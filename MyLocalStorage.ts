import { LocalStorage } from "node-localstorage";

export class MyLocalStorage {
  static #instance: MyLocalStorage;
  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MyLocalStorage();
    }
    return this.#instance;
  }
  private localstorage: LocalStorage = new LocalStorage("./scratch");
  get(key: string): string {
    const item = this.localstorage.getItem(key);
    if (!item) {
      return "";
    } else {
      return item;
    }
  }
  set(key: string, value: string) {
    this.localstorage.setItem(key, value);
  }
}
