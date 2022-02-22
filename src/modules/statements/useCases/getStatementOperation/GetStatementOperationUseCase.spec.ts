import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



describe("Get Balance", () => {

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

beforeEach(() => {
  inMemoryStatementsRepository = new InMemoryStatementsRepository();
  inMemoryUsersRepository = new InMemoryUsersRepository();
  createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
});

it("should be able get the statement operation", async () => {

  const user = await createUserUseCase.execute({
    name: "Test User-22",
    email: "test@email-22.com",
    password: "123455"
  });

  const statement = await createStatementUseCase.execute({
    amount: 250,
    description: "DEPOSIT",
    type: OperationType.DEPOSIT,
    user_id: user.id as string,
  });

  const user_id = user.id as string;
  const statement_id = statement.id as string;

  const getOperation = await getStatementOperationUseCase.execute({user_id, statement_id});

  console.log(getOperation);

  expect(getOperation.id).toEqual(statement_id)
  expect(getOperation.user_id).toEqual(user_id)

});

it("should not be able to get statement operation when the user does not exists", async () => {

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

    const user_id = user.id as string;
    const statement_id = statement.id as string;

    await getStatementOperationUseCase.execute({user_id, statement_id});

  }).rejects.toBeInstanceOf(AppError);


});

it("should not be able to get statement operation when the operation does not exists", async () => {

  expect( async () => {

    const user = await createUserUseCase.execute({
      name: "Test User-22",
      email: "test@email-22.com",
      password: "123455"
    });

    const statement = {
      id: "12345"
    }

    const user_id = user.id as string;
    const statement_id = statement.id as string;

    await getStatementOperationUseCase.execute({user_id, statement_id});

  }).rejects.toBeInstanceOf(AppError);


});






});
