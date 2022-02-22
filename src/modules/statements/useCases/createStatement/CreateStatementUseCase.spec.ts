import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";



describe("Create Statement", () => {

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

beforeEach(() => {
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  inMemoryUsersRepository = new InMemoryUsersRepository();
  createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
});

it("should be able to create a new statement", async () => {

  const user = await createUserUseCase.execute({
    name: "Test User-22",
    email: "test@email-22.com",
    password: "123455"
  });

  const statement = await createStatementUseCase.execute({
    amount: 500,
    description: "DEPOSIT",
    type: OperationType.DEPOSIT,
    user_id: user.id as string,
  });

  expect(statement).toHaveProperty("id");


});

it("should not be able to create a statement when the user does not exists", async () => {

  expect( async () => {

    const user = {
      id: "434823",
      name: "any",
      email: "any@aaa.com",
      password: "test"
    };

    const statement = await createStatementUseCase.execute({
      amount: 500,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id

    });

  }).rejects.toBeInstanceOf(AppError);


});

it("should not be able to withdraw an amount with insufficient founds", async () => {

  expect(async () => {

    const user = await createUserUseCase.execute({
      name: "Test User-22",
      email: "test@email-22.com",
      password: "123455"
    });

    await createStatementUseCase.execute({
      amount: 500,
      description: "DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    await createStatementUseCase.execute({
      amount: 600,
      description: "withdraw",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

  }).rejects.toBeInstanceOf(AppError);

});





});
