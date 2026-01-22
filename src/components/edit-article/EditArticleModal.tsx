"use client";

import React, { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  X,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImagePlus,
  Undo2,
  Redo2,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension, Mark, mergeAttributes } from "@tiptap/core";

type HomepageArticleDTO = {
  title?: string;
  body?: string; // HTML
};

function hasMeaningfulEditorContent(html: string, text: string) {
  const hasText = text.trim().length > 0;
  const hasImg = /<img\b[^>]*>/i.test(html);
  return hasText || hasImg;
}

/**
 * ✅ Guarantee `textStyle` mark exists in schema.
 * This prevents: "There is no mark type named 'textStyle'"
 */
const TextStyleMark = Mark.create({
  name: "textStyle",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      // FontSize extension will add fontSize as global attribute onto this mark.
      // Keeping this minimal is fine.
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

/**
 * FontSize extension (stores font-size on textStyle mark as inline CSS)
 * Adds: editor.chain().setFontSize("18px").run()
 */
const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain, editor }) => {
          // Safety guard (should always exist now because we define TextStyleMark)
          if (!editor.schema.marks?.textStyle) return false;
          return chain().setMark("textStyle", { fontSize }).run();
        },

      unsetFontSize:
        () =>
        ({ chain, editor }) => {
          if (!editor.schema.marks?.textStyle) return false;
          return chain().setMark("textStyle", { fontSize: null }).run();
        },
    } as any;
  },
});

export default function EditArticleModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editorClassName = [
    "min-h-[320px]",
    "w-full",
    "rounded-xl",
    "border",
    "border-gray-600",
    "bg-gray-800",
    "px-4",
    "py-3",
    "text-white",
    "outline-none",
    "focus:border-teal-500",
    "leading-relaxed",
    "[&_p]:my-2",
    "[&_h1]:text-3xl",
    "[&_h1]:font-bold",
    "[&_h1]:my-4",
    "[&_h2]:text-2xl",
    "[&_h2]:font-bold",
    "[&_h2]:my-4",
    "[&_h3]:text-xl",
    "[&_h3]:font-semibold",
    "[&_h3]:my-3",
    "[&_ul]:list-disc",
    "[&_ul]:pl-6",
    "[&_ul]:my-3",
    "[&_ol]:list-decimal",
    "[&_ol]:pl-6",
    "[&_ol]:my-3",
    "[&_li]:my-1",
    "[&_img]:mx-auto",
    "[&_img]:block",
    "[&_img]:max-w-full",
    "[&_img]:rounded-2xl",
    "[&_img]:border",
    "[&_img]:border-gray-700/60",
    "[&_img]:my-4",
  ].join(" ");

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Underline,

        // ✅ our guaranteed mark + fontsize
        TextStyleMark,
        FontSize,

        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Image.configure({
          inline: false,
          allowBase64: false,
          HTMLAttributes: { class: "mx-auto block" }, // keep images centered
        }),
        Placeholder.configure({ placeholder: "Write your article here…" }),
      ],
      content: "",
      editorProps: {
        attributes: { class: editorClassName },
      },
    },
    [isMounted]
  );

  // keep editability in sync
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isOpen && !loading && !saving);
  }, [editor, isOpen, loading, saving]);

  // Fetch article data when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (!isMounted) return;

    if (!BACKEND) {
      setError("NEXT_PUBLIC_BACKEND_URL is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${BACKEND}/api/v1/homepage-article`)
      .then(async (res) => {
        if (!res.ok) throw new Error("No article found");
        return res.json();
      })
      .then((data: HomepageArticleDTO) => {
        editor?.commands.setContent(data.body || "", false);
        setLoading(false);
      })
      .catch(() => {
        editor?.commands.setContent("", false);
        setError("No homepage article found.");
        setLoading(false);
      });
  }, [isOpen, isMounted, BACKEND, editor]);

  const handleCancel = () => {
    setError(null);
    editor?.commands.setContent("", false);
    onClose();
  };

  const triggerImagePicker = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!BACKEND) throw new Error("Backend URL not configured.");
    if (!editor) throw new Error("Editor not ready.");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${BACKEND}/api/v1/homepage-article/images`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to upload image");
    }

    const data = (await res.json()) as { url: string };
    if (!data?.url) throw new Error("Upload did not return an image URL");

    editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
    editor.chain().focus().enter().run();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    try {
      setSaving(true);
      setError(null);
      for (const file of files) await uploadAndInsertImage(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image(s)");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!BACKEND) {
      setError("NEXT_PUBLIC_BACKEND_URL is not configured.");
      return;
    }
    if (!editor) {
      setError("Editor not ready.");
      return;
    }

    const bodyHtml = editor.getHTML();
    const bodyText = editor.getText();

    if (!hasMeaningfulEditorContent(bodyHtml, bodyText)) {
      setError("Body is required (text or at least one image).");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND}/api/v1/homepage-article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // ✅ Title removed from UI; send empty string as requested
        body: JSON.stringify({ title: "", body: bodyHtml }),
      });

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

  const canSave = useMemo(() => {
    if (loading || saving) return false;
    if (!editor) return false;
    return hasMeaningfulEditorContent(editor.getHTML(), editor.getText());
  }, [loading, saving, editor]);

  if (!isOpen) return null;
  if (!isMounted) return null;

  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel} />

      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-[92vw] max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Edit Homepage Article</h2>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
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

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Font size */}
                <select
                  className="bg-gray-800 border border-gray-600 text-white rounded-xl px-3 py-2 text-sm"
                  disabled={!editor || saving}
                  defaultValue="16px"
                  onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}
                >
                  {fontSizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <div className="mx-1 h-8 w-px bg-gray-700" />

                {/* Text styles */}
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  disabled={!editor || saving}
                  className={`px-3 py-2 rounded-xl ${
                    editor?.isActive("bold") ? "bg-teal-700" : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  <Bold className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  disabled={!editor || saving}
                  className={`px-3 py-2 rounded-xl ${
                    editor?.isActive("italic") ? "bg-teal-700" : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  <Italic className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  disabled={!editor || saving}
                  className={`px-3 py-2 rounded-xl ${
                    editor?.isActive("underline") ? "bg-teal-700" : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  <UnderlineIcon className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  disabled={!editor || saving}
                  className={`px-3 py-2 rounded-xl ${
                    editor?.isActive("strike") ? "bg-teal-700" : "bg-gray-700 hover:bg-gray-600"
                  } text-white`}
                >
                  <Strikethrough className="w-4 h-4" />
                </Button>

                <div className="mx-1 h-8 w-px bg-gray-700" />

                {/* Alignment */}
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <AlignJustify className="w-4 h-4" />
                </Button>

                <div className="mx-1 h-8 w-px bg-gray-700" />

                {/* Lists */}
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>

                <div className="mx-1 h-8 w-px bg-gray-700" />

                {/* HR */}
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <Minus className="w-4 h-4" />
                </Button>

                {/* Undo / Redo */}
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>

                {/* Insert image */}
                <Button
                  type="button"
                  onClick={triggerImagePicker}
                  disabled={!editor || saving}
                  className="px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl"
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Insert Image
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Article Content</label>
                <EditorContent editor={editor} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-700 bg-gray-900/60">
          <Button
            onClick={handleCancel}
            disabled={saving}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="px-5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
