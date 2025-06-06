import mongoose, { Document, Schema } from 'mongoose';

export interface ITracking extends Document {
  trackingId: string;
  userId: string;
  affiliateLink: string;
  impactLink: string;  // Store the original Impact link
  status: 'pending' | 'converted' | 'failed';
  orderId?: string;
  impactOrderId?: string;  // Store Impact's order ID if available
  metadata?: {
    linkName?: string;
    source?: string;
    timestamp?: Date;
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
    conversionTimestamp?: Date;
    impactConversionData?: any;  // Store any Impact conversion data
  };
  retryCount: number;
  lastRetry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const trackingSchema = new Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  affiliateLink: {
    type: String,
    required: true
  },
  impactLink: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'converted', 'failed'],
    default: 'pending',
    index: true
  },
  orderId: {
    type: String,
    index: true
  },
  impactOrderId: {
    type: String,
    index: true
  },
  metadata: {
    linkName: String,
    source: String,
    timestamp: Date,
    userAgent: String,
    referrer: String,
    ipAddress: String,
    conversionTimestamp: Date,
    impactConversionData: Schema.Types.Mixed
  },
  retryCount: {
    type: Number,
    default: 0
  },
  lastRetry: {
    type: Date
  }
}, {
  timestamps: true
});

// Add indexes for common queries
trackingSchema.index({ createdAt: 1 });
trackingSchema.index({ status: 1, retryCount: 1 });
trackingSchema.index({ impactOrderId: 1 });  // Index for Impact order lookups

// Add method to handle retries
trackingSchema.methods.incrementRetry = async function() {
  this.retryCount += 1;
  this.lastRetry = new Date();
  await this.save();
};

// Add validation for status field
trackingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (!['pending', 'converted', 'failed'].includes(this.status)) {
      next(new Error('Invalid status value'));
    }
  }
  next();
});

export default mongoose.model<ITracking>('Tracking', trackingSchema); 