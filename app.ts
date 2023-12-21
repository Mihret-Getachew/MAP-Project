import { PetFinder } from "./classes/PetFinder";
import { PromptInput } from "./classes/Prompt";
import { PersistedStorage } from "./classes/Storage";
import { TokenManager } from "./classes/TokenManager";
import { ApiCredentials } from "./types/types";
import { BookmarkManager } from "./classes/BookmarkManager";

class Application {
  private credentialStorage: PersistedStorage<string | number> =
    new PersistedStorage("credentials");
  private tokenManager: TokenManager = new TokenManager(this.credentialStorage);
  private bookmarkStorage: PersistedStorage<string> = new PersistedStorage(
    "bookmarks"
  );
  private bookmarkManager: BookmarkManager = new BookmarkManager(
    this.bookmarkStorage
  );
  private petFinder: PetFinder = new PetFinder(this.bookmarkManager);
  private userPrompt: PromptInput = new PromptInput(this.petFinder);

  
  async run() {
    const apiCredentials = await this.tokenManager.init();
    this.userPrompt.init(apiCredentials);
  }
}

const application = new Application();
application.run();
