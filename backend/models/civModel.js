import mongoose from "mongoose";

const civSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const Unit = mongoose.model('Unit', unitSchema);