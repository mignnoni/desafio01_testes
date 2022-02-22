import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"


describe("Create User", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepositoryInMemory: InMemoryUsersRepository;

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "test@email.com",
      password: "1234"
    })

    expect(user).toHaveProperty("id");


  });

  it("should not be able to create a new user when email already exists", async () => {

    expect(async () => {

      await createUserUseCase.execute({
        name: "Test User",
        email: "test@email.com",
        password: "1234"
      })
      await createUserUseCase.execute({
        name: "Test User 2",
        email: "test@email.com",
        password: "1234"
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
