/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { useSendAccountDeletionRequestMutation } from "@/redux/features/api/authApi";

export default function PrivacyPolicy() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [sendRequest, { isLoading }] = useSendAccountDeletionRequestMutation();

  const user = useAppSelector((state) => state.auth.user);
  const userEmail = user?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalEmail = userEmail || email.trim();

    if (!finalEmail || !description.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      await sendRequest({
        email: finalEmail,
        description,
      }).unwrap();

      alert("✅ Your account deletion request has been sent to Trobits Community.");
      setDescription("");
      setEmail("");
      setIsFormOpen(false);
    } catch (err) {
      console.error("❌ Error sending request:", err);
      alert("Failed to send your account deletion request. Please try again later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-5 bg-transparent relative">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Privacy Policy</h1>
      <div className="text-white space-y-6">
        <p>
          Welcome to Trobits! Your privacy is important to us, and this Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.
        </p>
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p>When you use our platform, we may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Personal Information: Such as your name, email address, or other contact details when you sign up.</li>
          <li>Usage Data: Information about your interactions with our platform, including pages visited, features used, and time spent.</li>
          <li>Cookies: Data collected via cookies and similar tracking technologies to enhance your user experience.</li>
        </ul>

        <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide, operate, and maintain our platform.</li>
          <li>Improve, personalize, and expand our services.</li>
          <li>Understand and analyze usage trends.</li>
          <li>Communicate with you, including responding to inquiries and sending updates.</li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Information Sharing and Disclosure</h2>
        <p>We do not sell, trade, or rent your personal information to others. However, we may share your information in the following situations:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>With service providers who perform services on our behalf.</li>
          <li>To comply with legal obligations, protect our rights, and ensure the safety of our users.</li>
        </ul>

        <h2 className="text-2xl font-semibold">4. Data Security</h2>
        <p>
          We use reasonable administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold">5. Your Rights</h2>
        <p>
          Depending on your location, you may have rights under applicable privacy laws, including the right to access, correct, or delete your personal information.
        </p>

        <h2 className="text-2xl font-semibold">6. Third-Party Links</h2>
        <p>
          Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites.
        </p>

        <h2 className="text-2xl font-semibold">7. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated effective date.
        </p>

        <h2 className="text-2xl font-semibold">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:trobitscommunity@gmail.com" className="text-blue-400 underline">
            trobitscommunity@gmail.com
          </a>.
        </p>

        {/* ✅ Account Deletion Request Button */}
        <div className="text-center mt-10">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-all"
          >
            Request Account Deletion
          </Button>
        </div>
      </div>

      {/* ✅ Modal Form for Account Deletion */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-md shadow-xl text-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">Request Account Deletion</h2>
            <p className="text-gray-400 text-sm mb-4 text-center">
              Please provide your details and reason for deletion. This message will be sent to the Trobits Community team.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Show email input only if user is not logged in */}
              {!userEmail && (
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-1 text-gray-300">Reason for Deletion</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 resize-none focus:outline-none focus:border-red-500"
                  rows={4}
                  placeholder="Write your reason for deletion..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
