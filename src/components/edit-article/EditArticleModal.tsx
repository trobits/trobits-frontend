"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Article {
  title: string;
  body: string;
  image?: string; // existing image URL
}

export default function EditArticleModal({ isOpen, onClose }: EditArticleModalProps) {
  const [article, setArticle] = useState<Article>({ title: "", body: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (thumbPreview && thumbPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbPreview);
      }
    };
  }, [thumbPreview]);

  // Fetch article data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/homepage-article`)
      .then(async (res) => {
        if (!res.ok) throw new Error("No article found");
        return res.json();
      })
      .then((data) => {
        const imageUrl = data.image || "";
        setArticle({ title: data.title, body: data.body, image: imageUrl });
        setImageFile(null);
        setThumbPreview(imageUrl || null);
        setLoading(false);
      })
      .catch(() => {
        setError("No homepage article found.");
        setLoading(false);
      });
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", article.title);
      formData.append("body", article.body);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/homepage-article`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update article");
      }

      window.location.reload();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setArticle({ title: "", body: "" });
    setImageFile(null);

    if (thumbPreview && thumbPreview.startsWith("blob:")) URL.revokeObjectURL(thumbPreview);
    setThumbPreview(null);

    setError(null);
    onClose();
  };

  const handleInputChange = (field: keyof Article, value: string) => {
    setArticle((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (thumbPreview && thumbPreview.startsWith("blob:")) URL.revokeObjectURL(thumbPreview);

    setImageFile(file);

    if (file) {
      setThumbPreview(URL.createObjectURL(file));
    } else {
      setThumbPreview(article.image || null);
    }
  };

  if (!isOpen) return null;

  const selectedFileName = imageFile?.name || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel} />

      {/* Modal (smaller overall) */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[92vw] max-w-2xl overflow-hidden">
        {/* Header (tighter) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Edit Homepage Article</h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (fixed smaller height so footer always visible) */}
        <div className="px-5 py-4 overflow-y-auto max-h-[55vh]">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-gray-400">Loading article...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Title Input (tighter) */}
              <div>
                <label htmlFor="article-title" className="block text-sm font-medium text-gray-300 mb-2">
                  Article Title
                </label>
                <input
                  id="article-title"
                  type="text"
                  value={article.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="
                    w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-xl
                    text-white placeholder-gray-400 focus:outline-none focus:border-teal-500
                    transition-colors duration-200
                  "
                  placeholder="Enter article title..."
                />
              </div>

              {/* Image Input */}
              <div>
                <label htmlFor="article-image" className="block text-sm font-medium text-gray-300 mb-2">
                  Article Image (optional)
                </label>

                <input
                  id="article-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="
                    w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-xl
                    text-gray-300 file:mr-4 file:rounded-lg file:border-0
                    file:bg-gray-700 file:px-4 file:py-2 file:text-white
                    hover:file:bg-gray-600
                  "
                />

                {/* Compact row */}
                {(selectedFileName || thumbPreview) && (
                  <div className="mt-3 flex items-center gap-3 px-3 py-2 bg-gray-800/50 border border-gray-700/60 rounded-xl">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-700 bg-gray-900 shrink-0">
                      {thumbPreview ? (
                        <img
                          src={thumbPreview}
                          alt="Selected article thumbnail"
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-200 truncate">
                        {selectedFileName || "Current image selected"}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {imageFile ? "Ready to upload" : "Current image on server"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Body Textarea (smaller rows + tighter padding) */}
              <div>
                <label htmlFor="article-body" className="block text-sm font-medium text-gray-300 mb-2">
                  Article Content
                </label>
                <textarea
                  id="article-body"
                  value={article.body}
                  onChange={(e) => handleInputChange("body", e.target.value)}
                  rows={8}
                  className="
                    w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-xl
                    text-white placeholder-gray-400 focus:outline-none focus:border-teal-500
                    transition-colors duration-200 resize-vertical
                  "
                  placeholder="Enter article content..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer (always visible; compact) */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-700 bg-gray-900/60">
          <Button
            onClick={handleCancel}
            disabled={saving}
            className="
              px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving || loading || !article.title.trim() || !article.body.trim()}
            className="
              px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700
              text-white rounded-xl transition-all duration-200 shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
