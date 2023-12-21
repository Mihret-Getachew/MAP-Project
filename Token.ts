import { MyLocalStorage } from "./Mylocalstorage";
import { jwtDecode } from "jwt-decode";
import { fetch } from "cross-fetch";
import { Petfinder } from "./Pet_finder";
import { JWTType } from "./types";

export class Token {
  private myLocalStorage = MyLocalStorage.getInstance();
  async checkOnDataBase() {
    const token = this.myLocalStorage.get("token");
    if (!token) {
      await this.getToken();
    } else {
      const expired = this.checkExpiry(token);
      if (expired === false) {
        await this.getToken();
      }
    }
    const userInput = new Petfinder();
    userInput.getPet();
  }

  checkExpiry(token: string): boolean {
    const decodeToken = jwtDecode<JWTType>(token);
    const now = Math.floor(Date.now() / 1000);
    if (decodeToken.exp > now) return true;
    else {
      return false;
    }
  }

  async getToken() {
    const rawResponse: Response = await fetch(
      "https://api.petfinder.com/v2/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "client_credentials",
          client_id: "gMxO4HWye99cPW9p6u9X6baef7tbC4EP0R55zVowOZZKLOufDd",
          client_key: "whqhpQDv82aVWpBMG5hGiZDouxazKnuXmrSPMUkv",
        }),
      }
    );
    const jsonResponse = await rawResponse.json();
    this.myLocalStorage.set("token", JSON.stringify(jsonResponse.access_token));
  }
}
