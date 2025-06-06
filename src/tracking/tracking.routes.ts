import { Router } from 'express';
import Tracking from '../models/tracking';
import { logger } from '../utils/logger';

const router = Router();

// User validation interface
interface UserValidation {
  isValid: boolean;
  error?: string;
}

// Helper function to validate user
function validateUser(userId: string): UserValidation {
  if (!userId) {
    return { isValid: false, error: 'User ID is required' };
  }

  if (typeof userId !== 'string') {
    return { isValid: false, error: 'Invalid user ID format' };
  }

  // Add any additional user validation rules here
  // For example, check if user exists in your system
  return { isValid: true };
}

// Helper function to add tracking parameters to URL
function addTrackingParams(url: string, trackingId: string, userId: string): string {
  try {
    const urlObj = new URL(url);
    // Add our tracking ID as a parameter
    urlObj.searchParams.append('trobits_tracking_id', trackingId);
    // Add user identification
    urlObj.searchParams.append('trobits_user_id', userId);
    // Add timestamp for when the click happened
    urlObj.searchParams.append('trobits_click_time', Date.now().toString());
    // Add source parameter
    urlObj.searchParams.append('trobits_source', 'trobits_affiliate');
    // Add a hash of user ID and timestamp for additional security
    const userHash = Buffer.from(`${userId}-${Date.now()}`).toString('base64');
    urlObj.searchParams.append('trobits_hash', userHash);
    return urlObj.toString();
  } catch (error) {
    logger.error('Error adding tracking parameters:', error);
    return url; // Return original URL if there's an error
  }
}

// Helper function to extract Impact parameters
function extractImpactParams(url: string): { impactLink: string, impactParams: any } {
  try {
    const urlObj = new URL(url);
    const impactParams: any = {};
    
    // Extract Impact parameters
    if (urlObj.searchParams.has('ref')) {
      impactParams.ref = urlObj.searchParams.get('ref');
    }
    if (urlObj.searchParams.has('click_id')) {
      impactParams.clickId = urlObj.searchParams.get('click_id');
    }
    // Add any other Impact parameters you want to track
    
    // Create clean Impact link
    const impactLink = `${urlObj.origin}${urlObj.pathname}?ref=${impactParams.ref}`;
    
    return { impactLink, impactParams };
  } catch (error) {
    logger.error('Error extracting Impact parameters:', error);
    return { impactLink: url, impactParams: {} };
  }
}

router.post('/click', async (req, res) => {
  try {
    const { userId, affiliateLink, metadata = {}, userData = {} } = req.body;
    
    // Validate user
    const userValidation = validateUser(userId);
    if (!userValidation.isValid) {
      return res.status(400).json({ 
        error: 'Invalid user data',
        message: userValidation.error 
      });
    }

    // Extract Impact parameters
    const { impactLink, impactParams } = extractImpactParams(affiliateLink);

    // Generate a unique tracking ID
    const trackingId = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add tracking parameters to the affiliate link
    const taggedLink = addTrackingParams(affiliateLink, trackingId, userId);
    
    // Create tracking record with additional metadata
    const tracking = await Tracking.create({
      trackingId,
      userId,
      affiliateLink: taggedLink,
      impactLink, // Store the original Impact link
      metadata: {
        ...metadata,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        referrer: req.headers.referer,
        timestamp: new Date(),
        originalLink: affiliateLink,
        impactParams, // Store Impact parameters
        userHash: Buffer.from(`${userId}-${Date.now()}`).toString('base64'),
        userData: {
          email: userData.email,
          username: userData.username,
          userType: userData.userType,
          registrationDate: userData.registrationDate,
          lastLogin: userData.lastLogin,
          userPreferences: userData.preferences,
          deviceInfo: {
            deviceType: userData.deviceType,
            browser: userData.browser,
            os: userData.os
          },
          location: {
            country: userData.country,
            region: userData.region,
            city: userData.city
          }
        },
        clickContext: {
          pageUrl: req.headers.referer,
          pageTitle: metadata.pageTitle,
          elementId: metadata.elementId,
          elementType: metadata.elementType,
          screenSize: metadata.screenSize,
          viewportSize: metadata.viewportSize
        }
      }
    });

    // Log the click for monitoring with user context
    logger.info(`Click tracked: ${trackingId} for user ${userId}`, {
      trackingData: {
        trackingId,
        userId,
        affiliateLink: taggedLink,
        impactLink,
        status: tracking.status,
        metadata: tracking.metadata,
        userData: userData,
        timestamp: tracking.createdAt
      }
    });

    return res.json({ 
      trackingId,
      timestamp: tracking.createdAt,
      status: 'success',
      taggedLink,
      impactLink,
      userId,
      userData: {
        userType: userData.userType,
        deviceType: userData.deviceType
      }
    });
  } catch (error: any) {
    logger.error('Error tracking click:', error);
    return res.status(500).json({ 
      error: 'Failed to track click',
      message: error.message 
    });
  }
});

router.post('/conversion', async (req, res) => {
  try {
    const { trackingId, orderId, metadata = {} } = req.body;
    const tracking = await Tracking.findOne({ trackingId });
    if (!tracking) {
      return res.status(404).json({ 
        error: 'Tracking record not found',
        trackingId 
      });
    }
    const updatedTracking = await Tracking.findOneAndUpdate(
      { trackingId },
      { 
        status: 'converted',
        orderId,
        metadata: {
          ...tracking.metadata,
          ...metadata,
          conversionTimestamp: new Date()
        }
      },
      { new: true }
    );
    if (!updatedTracking) {
      return res.status(500).json({ error: 'Failed to update tracking record' });
    }
    logger.info(`Conversion recorded: ${trackingId} for order ${orderId}`);
    return res.json({ 
      success: true, 
      data: {
        trackingId,
        orderId,
        status: 'converted',
        timestamp: updatedTracking.updatedAt
      }
    });
  } catch (error: any) {
    logger.error('Error processing conversion:', error);
    return res.status(500).json({ 
      error: 'Failed to process conversion',
      message: error.message 
    });
  }
});

// Add a route to check tracking status
router.get('/status/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const tracking = await Tracking.findOne({ trackingId });
    if (!tracking) {
      return res.status(404).json({ 
        error: 'Tracking record not found',
        trackingId 
      });
    }
    return res.json({
      trackingId,
      status: tracking.status,
      userId: tracking.userId,
      orderId: tracking.orderId,
      createdAt: tracking.createdAt,
      updatedAt: tracking.updatedAt,
      metadata: tracking.metadata
    });
  } catch (error: any) {
    logger.error('Error fetching tracking status:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch tracking status',
      message: error.message 
    });
  }
});

// Test endpoint to view tracking records
router.get('/test-records', async (_req, res) => {
    try {
        const records = await Tracking.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
            
        res.json({
            count: records.length,
            records: records.map((record) => ({
                trackingId: record.trackingId,
                userId: record.userId,
                affiliateLink: record.affiliateLink,
                status: record.status,
                metadata: record.metadata,
                createdAt: record.createdAt
            }))
        });
    } catch (error) {
        logger.error('Error fetching test records:', error);
        res.status(500).json({ error: 'Failed to fetch tracking records' });
    }
});

// Add a route to handle Impact conversion webhooks
router.post('/impact-webhook', async (req, res) => {
  try {
    const { 
      click_id,
      order_id,
      order_value,
      commission,
      currency,
      status,
    } = req.body;
    const tracking = await Tracking.findOne({
      'metadata.impactParams.clickId': click_id
    });
    if (!tracking) {
      logger.warn(`No tracking record found for Impact click ID: ${click_id}`);
      return res.status(404).json({ error: 'Tracking record not found' });
    }
    await Tracking.findOneAndUpdate(
      { _id: tracking._id },
      {
        status: 'converted',
        impactOrderId: order_id,
        metadata: {
          ...tracking.metadata,
          impactConversionData: {
            orderId: order_id,
            orderValue: order_value,
            commission,
            currency,
            status,
            conversionTimestamp: new Date()
          }
        }
      },
      { new: true }
    );
    logger.info(`Impact conversion recorded: ${order_id} for tracking ${tracking.trackingId}`);
    return res.json({
      success: true,
      data: {
        trackingId: tracking.trackingId,
        orderId: order_id,
        status: 'converted'
      }
    });
  } catch (error: any) {
    logger.error('Error processing Impact webhook:', error);
    return res.status(500).json({
      error: 'Failed to process Impact webhook',
      message: error.message
    });
  }
});

export { router as trackingRoutes }; 