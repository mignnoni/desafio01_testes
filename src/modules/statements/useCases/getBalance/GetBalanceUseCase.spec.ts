import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



describe("Get Balance", () => {

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

beforeEach(() => {
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  inMemoryUsersRepository = new InMemoryUsersRepository();
  createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
});

it("should be able get the balance of statements", async () => {

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

  const user_id = user.id as string;

  const getBalance = await getBalanceUseCase.execute({user_id});

  expect(getBalance).toHaveProperty("balance");


});

it("should not be able to get balance when the user does not exists", async () => {

  expect( async () => {

    const user = {
      id: "434823",
      name: "any",
      email: "any@aaa.com",
      password: "test"
    };

    await createStatementUseCase.execute({
      amount: 500,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id

    });

    const user_id = user.id as string;

    await getBalanceUseCase.execute({user_id});

  }).rejects.toBeInstanceOf(AppError);


});






});
