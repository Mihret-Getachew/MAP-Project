import { LocalStorage } from "node-localstorage";

export class MyLocalStorage {

  static #instance: MyLocalStorage;
  private localstorage: LocalStorage = new LocalStorage("./scratch");
  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MyLocalStorage();
    }
    return this.#instance;
  }

  // method to read from local storage
  get(key: string): string {
    const item = this.localstorage.getItem(key);
    if (!item) {
      return "";
    } else {
      return item;
    }
  }

  // method to write to local storage
  set(key: string, value: string) {
    this.localstorage.setItem(key, value);
  }
}
