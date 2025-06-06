export interface ImpactResponse {
    success: boolean;
    trackingId: string;
    orderId: string;
    timestamp: string;
}

export class ImpactService {
    async validateConversion(trackingId: string, orderId: string): Promise<ImpactResponse> {
        // Mock implementation - in production this would call the Impact API
        return {
            success: true,
            trackingId,
            orderId,
            timestamp: new Date().toISOString()
        };
    }
} 