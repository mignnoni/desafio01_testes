import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


describe("Show User Profile", () => {

  let showUserProfileUseCase: ShowUserProfileUseCase;
  let createUserUseCase: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show the user profile", async () => {

    const user = await createUserUseCase.execute({
        name: "Test User Show Profile",
        email: "testshow@email.com",
        password: "1234"
    });

    const showUserProfile = await showUserProfileUseCase.execute(user.id as string);

    expect(showUserProfile.id).toEqual(user.id);
  });

  it("should not be able to show a non existent user", async () => {

    expect(async () => {

      const user = {
        id: "12345",
        name: "anyone",
        email: "any@email.com",
        password: "test"
      };

      const showUserProfile = await showUserProfileUseCase.execute(user.id);
    }).rejects.toBeInstanceOf(AppError);

  });

});
