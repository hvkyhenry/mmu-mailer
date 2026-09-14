/**
 * Deliberately minimal: only formatting people will actually use in a club
 * email. TipTap supports far more (tables, code blocks) via StarterKit —
 * we're just not exposing buttons for it, to avoid the canvas looking like
 * a full word processor.
 */
export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  const Btn = ({ active, onClick, label, title }) => (
    <button
      type="button"
      className={`toolbar-btn${active ? " active" : ""}`}
      onMouseDown={(e) => e.preventDefault()} // keep focus in editor, not the button
      onClick={onClick}
      title={title}
    >
      {label}
    </button>
  );

  return (
    <div className="editor-toolbar">
      <Btn label="B" title="Bold" active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()} />
      <Btn label="I" title="Italic" active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()} />
      <Btn label="H2" title="Heading" active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      <Btn label="H3" title="Subheading" active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
      <Btn label="Link" title="Insert/edit link" active={editor.isActive("link")}
        onClick={() => editor.chain().focus().toggleLink().run()} />
      <Btn label="• List" title="Bullet list" active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <Btn label="1. List" title="Numbered list" active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()} />
    </div>
  );
}