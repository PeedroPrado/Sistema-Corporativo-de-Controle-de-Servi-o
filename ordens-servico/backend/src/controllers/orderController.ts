import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";


function normalizeOrder(order: any) {
    const obj = order.toObject();
    obj.valorServico = parseFloat(order.valorServico.toString());
    return obj;
}

export async function createOrder(req: Request, res: Response) {
    try {
        const data = req.body;

        data.valorServico = mongoose.Types.Decimal128.fromString(
            String(data.valorServico)
        );

        const order = await Order.create(data);

        return res.status(201).json(normalizeOrder(order));

    } catch (error) {
        console.error("Erro ao criar ordem: ", error);
        return res.status(500).json({ message: "Erro ao criar ordem" });
    }
}

export async function getOrders(req: Request, res: Response) {
    try {
        const { titulo, status, prioridade, setor } = req.query;

        const filter: any = {};
        if (titulo) filter.titulo = { $regex: String(titulo), $options: "i" };
        if (status) filter.status = status;
        if (prioridade) filter.prioridade = prioridade;
        if (setor) filter.setorSolicitante = setor;

        const orders = await Order.find(filter).sort({ dataAbertura: -1 });

        
        const normalized = orders.map(normalizeOrder);

        return res.json(normalized);

    } catch (error) {
        console.error("Erro ao listar ordens: ", error);
        return res.status(500).json({ message: "Erro ao listar ordens" });
    }
}

export async function getOrderById(req: Request, res: Response) {
    try {
        const order = await Order.findById(req.params.id);

        if (!order)
            return res.status(404).json({ message: "Ordem não encontrada" });

        return res.json(normalizeOrder(order));

    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar ordem" });
    }
}

export async function updateOrder(req: Request, res: Response) {
    try {
        const updates = req.body;

        if (updates.valorServico) {
            updates.valorServico = mongoose.Types.Decimal128.fromString(
                String(updates.valorServico)
            );
        }

        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Ordem não encontrada" });

        return res.json(normalizeOrder(updated));

    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar ordem" });
    }
}

export async function deleteOrder(req: Request, res: Response) {
    try {
        const order = await Order.findById(req.params.id);

        if (!order)
            return res.status(404).json({ message: "Ordem não encontrada" });

        if (order.status !== "concluída" && order.status !== "cancelada") {
            return res.status(400).json({
                message:
                    "Só é possivel excluir ordens concluídas ou canceladas "
            });
        }

        await order.deleteOne();

        return res.json({ message: "Ordem excluída" });

    } catch (error) {
        return res
            .status(500)
            .json({ message: "Erro ao excluir ordem" });
    }
}
