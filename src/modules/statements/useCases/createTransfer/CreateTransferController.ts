import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferUseCase } from './CreateTransferUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;

    const { receiver_id } = request.params;

    const splittedPath = request.originalUrl.split('/')

    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({

      sender_id,
      receiver_id,
      type,
      description,
      amount
    })

    return response.status(200).json(transfer);
  }
}

export { CreateTransferController };
