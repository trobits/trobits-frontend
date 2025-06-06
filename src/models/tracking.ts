import mongoose, { Document, Schema } from 'mongoose';

export interface ITracking extends Document {
    trackingId: string;
    userId: string;
    impactLink: string;
    status: 'pending' | 'clicked' | 'converted';
    orderId?: string;
    metadata?: {
        linkName?: string;
        source?: string;
        timestamp?: Date;
        userAgent?: string;
        referrer?: string;
        ipAddress?: string;
        conversionTimestamp?: Date;
        impactResponse?: any;
    };
    createdAt: Date;
    updatedAt: Date;
}

const trackingSchema = new Schema<ITracking>({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    impactLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'clicked', 'converted'],
        default: 'pending'
    },
    orderId: { type: String },
    metadata: {
        linkName: String,
        source: String,
        timestamp: Date,
        userAgent: String,
        referrer: String,
        ipAddress: String,
        conversionTimestamp: Date,
        impactResponse: Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Prevent model overwrite error
const Tracking = mongoose.models.Tracking || mongoose.model<ITracking>('Tracking', trackingSchema);
export default Tracking; 