import mongoose from "mongoose";

const civSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        units: [
            {
                unit: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Unit'
                },
                powerModifier: Number,
            }
        ]
    },
    {
        timestamps: true,
    }
);

export const Civ = mongoose.model('Civ', civSchema);