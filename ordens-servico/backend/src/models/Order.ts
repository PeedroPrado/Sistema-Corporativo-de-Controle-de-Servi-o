import { Schema, model, Document, Types } from "mongoose";

export interface IOrder extends Document {
  titulo: string;
  descricao: string;
  dataAbertura: Date;
  status: "aberta" | "em andamento" | "concluída" | "cancelada";
  prioridade: "baixa" | "média" | "alta";
  responsavel?: string | null;
  setorSolicitante: string;
  prazoEstimado?: Date | null;
  valorServico: Types.Decimal128;
}

const OrderSchema = new Schema<IOrder>({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  dataAbertura: { type: Date, default: () => new Date() },
  status: {
    type: String,
    enum: ["aberta", "em andamento", "concluída", "cancelada"],
    default: "aberta"
  },
  prioridade: {
    type: String,
    enum: ["baixa", "média", "alta"],
    required: true
  },
  responsavel: { type: String, default: null },
  setorSolicitante: { type: String, required: true },
  prazoEstimado: { type: Date, default: null },
  valorServico: { type: Schema.Types.Decimal128, required: true }
});

export default model<IOrder>("Order", OrderSchema);
