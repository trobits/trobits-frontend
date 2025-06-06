'use client';

import { useState } from 'react';

export default function TestTrackingPage() {
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<any>(null);
  const [testRecords, setTestRecords] = useState<any[]>([]);

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tracking/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'test_user',
          impactLink: 'https://coinbase-consumer.sjv.io/GKQLem',
          userData: {
            email: 'test@example.com',
            username: 'testuser',
            userType: 'basic',
            deviceType: 'desktop',
            browser: 'chrome',
            os: 'macos',
            country: 'US'
          },
          metadata: {
            pageTitle: 'Test Page',
            elementId: 'test-button',
            elementType: 'button',
            screenSize: '1920x1080',
            campaignId: 'test_campaign',
            source: 'frontend_test'
          }
        })
      });

      const data = await response.json();
      console.log('Click tracked:', data);
      setTrackingId(data.trackingId);
      alert('Click tracked! Check the tracking status below.');
    } catch (error) {
      console.error('Error tracking click:', error);
      alert('Error tracking click. Check console for details.');
    }
  };

  const checkStatus = async () => {
    if (!trackingId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/tracking/status/${trackingId}`);
      const data = await response.json();
      setTrackingStatus(data);
    } catch (error) {
      console.error('Error checking status:', error);
      alert('Error checking status. Check console for details.');
    }
  };

  const viewTestRecords = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tracking/test-records');
      const data = await response.json();
      setTestRecords(data.records);
    } catch (error) {
      console.error('Error fetching test records:', error);
      alert('Error fetching test records. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Affiliate Tracking</h1>
          
          <div className="space-y-6">
            {/* Click Tracking Section */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">1. Track a Click</h2>
              <button
                onClick={handleClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Click this affiliate link
              </button>

              {trackingId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-md font-medium text-gray-900">Tracking ID:</h3>
                  <p className="mt-1 text-sm text-gray-600">{trackingId}</p>
                </div>
              )}
            </div>

            {/* Status Check Section */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">2. Check Status</h2>
              <button
                onClick={checkStatus}
                disabled={!trackingId}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              >
                Check Tracking Status
              </button>

              {trackingStatus && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-md font-medium text-gray-900">Status Details:</h3>
                  <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(trackingStatus, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Test Records Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">3. View Recent Records</h2>
              <button
                onClick={viewTestRecords}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Recent Tracking Records
              </button>

              {testRecords.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-md font-medium text-gray-900">Recent Records:</h3>
                  <div className="mt-2 space-y-4">
                    {testRecords.map((record) => (
                      <div key={record.trackingId} className="border-b pb-2">
                        <p className="text-sm font-medium">ID: {record.trackingId}</p>
                        <p className="text-sm text-gray-600">Status: {record.status}</p>
                        <p className="text-sm text-gray-600">Time: {new Date(record.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 