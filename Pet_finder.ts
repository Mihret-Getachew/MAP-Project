import { MyLocalStorage } from "./Mylocalstorage";
import prompts from "prompts";
import {
  PetDescription,
  PetDetailResponse,
  PetOption,
  PetResponse,
} from "./types";
import { Bookmark } from "./Bookmark";
export class Petfinder {
  private myLocalStorage = MyLocalStorage.getInstance();
  async getPet() {
    // get input from user
    const userInput = await prompts([
      {
        type: "text",
        name: "name",
        message: "Enter the animal name (optional)",
      },
      {
        type: "select",
        name: "type",
        message: "Select the animal type",
        choices: [
          { title: "Dog", value: "Dog" },
          { title: "Cat", value: "Cat" },
        ],
      },
      {
        type: "select",
        name: "gender",
        message: "Select the animal gender",
        choices: [
          { title: "Male", value: "Male" },
          { title: "Female", value: "Female" },
        ],
      },
    ]);

    // make query string
    let queryString = `type=${userInput.type}&gender=${userInput.gender}`;
    if (userInput.name) {
      queryString += `&name=${userInput.name}`;
    }

    // get token from local storage
    const token = JSON.parse(this.myLocalStorage.get("token"));

    // send request
    const rawResponse: Response = await fetch(
      `https://api.petfinder.com/v2/animals?${queryString}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` } }
    );
    const jsonResponse: PetResponse = await rawResponse.json();

    // make pet options for prompt
    const pets: PetOption[] = jsonResponse.animals.map((animal) => {
      return { value: animal.id, title: animal.name };
    });

    // show pet names as option
    const selectedPet = await prompts([
      {
        type: "select",
        name: "petId",
        message: "Select the animal name",
        choices: pets,
      },
    ]);

    // get the pet detail
    this.getPetDetail(selectedPet.petId);
  }

  async getPetDetail(petId: number) {
    // get token from local storage
    const token = JSON.parse(this.myLocalStorage.get("token"));

    // send request
    const rawResponse: Response = await fetch(
      `https://api.petfinder.com/v2/animals/${petId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const jsonResponse: PetDetailResponse = await rawResponse.json();

    // show pet detail
    const petDetail: PetDescription = jsonResponse.animal;
    console.log(`
    Name: ${petDetail.name},
    Breed: ${petDetail.breeds.primary},
    Size: ${petDetail.size},
    Age: ${petDetail.age},
    Colors: ${petDetail.colors.primary},
    Status: ${petDetail.status}`);

    const bookMark: Bookmark = new Bookmark();

    // start bookmark options
    await bookMark.selectAction({ id: petDetail.id, name: petDetail.name });
    this.getPet();
  }
}
