import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

/**
 * Thin wrapper around TipTap. Exposes `editor` upward via onReady so the
 * parent (Canvas) can trigger variable-insertion and other commands without
 * this component needing to know what a "variable" is — keeps this file
 * reusable, not tangled up with this app's templating logic.
 */
export default function RichTextEditor({ content, onChange, onReady, placeholder }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false, // images sit on their own line/block — simpler
        // positioning model for now (see Issue #5 notes on text-wrap).
        HTMLAttributes: { style: "max-width: 100%; border-radius: 4px;" },
      }),
      Placeholder.configure({ placeholder: placeholder || "Write your message..." }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) onReady?.(editor);
  }, [editor, onReady]);

  // Keep editor in sync when content is swapped externally (e.g. loading a
  // saved template) rather than typed — TipTap won't pick that up on its own.
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor]);

  return <EditorContent editor={editor} className="rich-editor" />;
}