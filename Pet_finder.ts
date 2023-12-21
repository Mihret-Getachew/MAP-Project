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

    let queryString = `type=${userInput.type}&gender=${userInput.gender}`;
    if (userInput.name) {
      queryString += `&name=${userInput.name}`;
    }

    const token = JSON.parse(this.myLocalStorage.get("token"));
    const rawResponse: Response = await fetch(
      `https://api.petfinder.com/v2/animals?${queryString}`,
      { method: "GET", headers: { Authorization: `Bearer ${token}` } }
    );

    const jsonResponse: PetResponse = await rawResponse.json();

    const pets: PetOption[] = jsonResponse.animals.map((animal) => {
      return { value: animal.id, title: animal.name };
    });

    const selectedPet = await prompts([
      {
        type: "select",
        name: "petId",
        message: "Select the animal name",
        choices: pets,
      },
    ]);

    this.getPetDetail(selectedPet.petId);
  }
  async getPetDetail(petId: number) {
    const token = JSON.parse(this.myLocalStorage.get("token"));
    const rawResponse: Response = await fetch(
      `https://api.petfinder.com/v2/animals/${petId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const jsonResponse: PetDetailResponse = await rawResponse.json();
    const petDetail: PetDescription = jsonResponse.animal;
    console.log(`
    Name: ${petDetail.name},
    Breed: ${petDetail.breeds.primary},
    Size: ${petDetail.size},
    Age: ${petDetail.age},
    Colors: ${petDetail.colors.primary},
    Status: ${petDetail.status}`);

    const bookMark: Bookmark = new Bookmark();
    bookMark.selectAction({ id: petDetail.id, name: petDetail.name });
  }
}
