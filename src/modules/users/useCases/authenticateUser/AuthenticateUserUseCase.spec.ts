import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("Authenticate User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            inMemoryUsersRepository
        );
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });


    it("should be able to authenticate an user", async () => {


        const user: ICreateUserDTO = {
          name: "User Test",
          email: "test@test.com",
          password: "1234",
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate a non existent user", async () => {


        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "test@user.com",
                password: "testpassword",
            });

        }).rejects.toBeInstanceOf(AppError);


    });

    it("should not be able to authenticate a user with wrong password", async () => {


      expect(async () => {
        const user: ICreateUserDTO = {
          name: "User Test",
          email: "test@test.com",
          password: "1234",
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: "wrongpassword",
        });

      }).rejects.toBeInstanceOf(AppError);


  });

});


