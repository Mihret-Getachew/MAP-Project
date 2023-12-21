import prompts from "prompts";
import { MyLocalStorage } from "./Mylocalstorage";
import { Pet } from "./types";

export class Bookmark {
  private temp_bookmark: Pet[];
  private localStorage: MyLocalStorage;
  constructor() {
    this.temp_bookmark = [];

    // get object from singleton
    this.localStorage = MyLocalStorage.getInstance();

    // read bookmark and update temp
    const bookMark = this.localStorage.get("bookmark");
    if (!bookMark) {
      this.localStorage.set("bookmark", JSON.stringify([]));
    } else {
      this.temp_bookmark = JSON.parse(bookMark);
    }
  }


  
  async selectAction(pet: Pet) {

    // ask the user to select an option
    const selected = await prompts([
      {
        type: "select",
        name: "type",
        message: "Select action",
        choices: [
          { title: "add", value: "add" },
          { title: "remove", value: "remove" },
          { title: "display", value: "display" },
        ],
      },
    ]);

    

    // check selected option and call the function
    if (selected.type === "add") {
      this.#add(pet);
    } else if (selected.type === "remove") {
      this.#remove(pet);
    } else {
      this.#display();
    }
  }
  
  #add(pet: Pet) {

    // check if pet exists
    const petExists = this.temp_bookmark.findIndex(({ id }) => id === pet.id);

    // add to temp and save to local storage
    if (petExists === -1) {
      this.temp_bookmark.push(pet);
      this.localStorage.set("bookmark", JSON.stringify(this.temp_bookmark));
    }
  }
  
  #remove(pet: Pet) {
    // check if pet exists
    const petExists = this.temp_bookmark.findIndex(({ id }) => id === pet.id);

    // remove from temp and save to local storage
    if (!(petExists === -1)) {
      this.temp_bookmark = this.temp_bookmark.filter(({ id }) => id !== pet.id);
      this.localStorage.set("bookmark", JSON.stringify(this.temp_bookmark));
    }
  }

  #display() {
    this.temp_bookmark.forEach((pet) => {
      console.log(pet);
    });
  }
}
