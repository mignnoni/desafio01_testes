import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
constructor(
  @inject('UsersRepository')
  private usersRepository: IUsersRepository,

  @inject('StatementsRepository')
  private statementsRepository: IStatementsRepository
) {}


    async execute({sender_id, receiver_id, type, amount, description}: ICreateTransferDTO) {

        const userSender = await this.usersRepository.findById(sender_id);

        if(!userSender) {
          throw new CreateStatementError.UserNotFound();
        }

        const userReceiver = await this.usersRepository.findById(receiver_id);

        if(!userReceiver) {
          throw new CreateStatementError.UserNotFound();
        }


        if(type === 'transfer') {
          const { balance } = await this.statementsRepository.getUserBalance({user_id: sender_id});

          if (balance < amount) {
            throw new CreateStatementError.InsufficientFunds()
          }
        }

        console.log(sender_id);

        const transferSender = await this.statementsRepository.create({
            type,
            amount,
            description,
            user_id: sender_id,
            sender_id: sender_id
        });

        await this.statementsRepository.create({
          type,
          amount,
          description,
          user_id: receiver_id,
          sender_id: sender_id
        })



        return transferSender;
    }
}

export { CreateTransferUseCase };
