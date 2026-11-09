import mongoose from "mongoose";
import Agent from "../models/Agent.model.js";

export const createAgent = async (req, res) => {
    try {
        const { name, description, knowledgeBase, instructions, tools } = req.body;
        if (typeof name !== "string" || !name.trim() ||
            typeof instructions !== "string" || !instructions.trim() ||
            (tools !== undefined && !Array.isArray(tools))) {
            return res.status(400).json({
                message: "A name, instructions, and a valid tools list are required.",
                success: false,
            });
        }
        if (knowledgeBase && !mongoose.isValidObjectId(knowledgeBase)) {
            return res.status(400).json({ message: "Invalid knowledge base id.", success: false });
        }
        const createdAgent = await Agent.create({
            userId: req.user._id,
            agentName: name.trim(),
            description: typeof description === "string" ? description.trim() : "",
            ...(knowledgeBase ? { knowledgeBase } : {}),
            instructions: instructions.trim(),
            tools: (tools || []).map((tool) =>
                typeof tool === "string" ? { type: tool } : tool
            ),
        });
        return res.status(201).json({
            message: "Agent created successfully",
            success: true,
            agent: createdAgent,
        });
    } catch (error) {
        console.error("Unable to create agent:", error);
        return res.status(500).json({ message: "Unable to create agent.", success: false });
    }
};

export const getAllAgent = async (req, res) => {
    try {
        const allAgent = await Agent.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Agents fetched successfully",
            success: true,
            allAgent,
        });
    } catch (error) {
        console.error("Unable to fetch agents:", error);
        return res.status(500).json({ message: "Unable to fetch agents.", success: false });
    }
};

export const getAgentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid agent id.", success: false });
        }
        const foundAgent = await Agent.findOne({ _id: id, userId: req.user._id });
        if (!foundAgent) {
            return res.status(404).json({ message: "Agent not found.", success: false });
        }
        return res.status(200).json({
            message: "Agent fetched successfully",
            success: true,
            agent: foundAgent,
        });
    } catch (error) {
        console.error("Unable to fetch agent:", error);
        return res.status(500).json({ message: "Unable to fetch agent.", success: false });
    }
};

export const deleteAgent = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid agent id.", success: false });
        }
        const agentToBeDeleted = await Agent.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });
        if (!agentToBeDeleted) {
            return res.status(404).json({ message: "Agent not found.", success: false });
        }
        return res.status(200).json({
            message: "Agent deleted successfully",
            success: true,
            agent: agentToBeDeleted,
        });
    } catch (error) {
        console.error("Unable to delete agent:", error);
        return res.status(500).json({ message: "Unable to delete agent.", success: false });
    }
};