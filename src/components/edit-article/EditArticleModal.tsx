"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Article {
  title: string;
  body: string;
}

export default function EditArticleModal({ isOpen, onClose }: EditArticleModalProps) {
  const [article, setArticle] = useState<Article>({ title: "", body: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch article data when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/homepage-article`)
        .then(async (res) => {
          if (!res.ok) throw new Error("No article found");
          return res.json();
        })
        .then((data) => {
          setArticle({ title: data.title, body: data.body });
          setLoading(false);
        })
        .catch(() => {
          setError("No homepage article found.");
          setLoading(false);
        });
    }
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/homepage-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          body: article.body,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update article');
      }

      // Success - reload page and close modal
      window.location.reload();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form and close
    setArticle({ title: "", body: "" });
    setError(null);
    onClose();
  };

  const handleInputChange = (field: keyof Article, value: string) => {
    setArticle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Edit Homepage Article</h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading article...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-600/50 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Title Input */}
              <div>
                <label htmlFor="article-title" className="block text-sm font-medium text-gray-300 mb-2">
                  Article Title
                </label>
                <input
                  id="article-title"
                  type="text"
                  value={article.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="
                    w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl
                    text-white placeholder-gray-400 focus:outline-none focus:border-teal-500
                    transition-colors duration-200
                  "
                  placeholder="Enter article title..."
                />
              </div>

              {/* Body Textarea */}
              <div>
                <label htmlFor="article-body" className="block text-sm font-medium text-gray-300 mb-2">
                  Article Content
                </label>
                <textarea
                  id="article-body"
                  value={article.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                  rows={15}
                  className="
                    w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl
                    text-white placeholder-gray-400 focus:outline-none focus:border-teal-500
                    transition-colors duration-200 resize-vertical
                  "
                  placeholder="Enter article content..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 bg-gray-900/50">
          <Button
            onClick={handleCancel}
            disabled={saving}
            className="
              px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl
              transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading || !article.title.trim() || !article.body.trim()}
            className="
              px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700
              text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}