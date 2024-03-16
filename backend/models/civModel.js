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
        image: {
            type: String,
            required: false
        },
        units: {
            feudal: [
                {
                    unit: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Unit'
                    },
                    powerModifier: Number,
                    _id: false
                }
            ],
            castle: [
                {
                    unit: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Unit'
                    },
                    powerModifier: Number,
                    _id: false
                }
            ],
            imperial: [
                {
                    unit: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Unit'
                    },
                    powerModifier: Number,
                    _id: false
                }
            ]
        }
    },
    {
        timestamps: true,
    }
);

export const Civ = mongoose.model('Civ', civSchema);