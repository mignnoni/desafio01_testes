import { OperationType } from "../../entities/Statement";

interface ICreateTransferDTO {

  receiver_id: string;
  sender_id: string;
  description: string;
  amount: number;
  type: OperationType;

}

export { ICreateTransferDTO };
