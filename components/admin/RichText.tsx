"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type BtnDef = {
  label: string;
  title: string;
  cls?: string;
  active?: (e: Editor) => boolean;
  can?: (e: Editor) => boolean;
  run: (e: Editor) => void;
};

/** Groups stay together when the bar wraps on narrow screens. */
const GROUPS: BtnDef[][] = [
  [
    { label: "B", title: "Bold (Ctrl/⌘+B)", cls: "is-bold", active: (e) => e.isActive("bold"), run: (e) => e.chain().focus().toggleBold().run() },
    { label: "I", title: "Italic (Ctrl/⌘+I)", cls: "is-italic", active: (e) => e.isActive("italic"), run: (e) => e.chain().focus().toggleItalic().run() },
    { label: "S", title: "Strikethrough (Ctrl/⌘+Shift+S)", cls: "is-strike", active: (e) => e.isActive("strike"), run: (e) => e.chain().focus().toggleStrike().run() },
  ],
  [
    { label: "H2", title: "Heading 2 (Ctrl/⌘+Alt+2)", active: (e) => e.isActive("heading", { level: 2 }), run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "H3", title: "Heading 3 (Ctrl/⌘+Alt+3)", active: (e) => e.isActive("heading", { level: 3 }), run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  ],
  [
    { label: "•", title: "Bullet list", active: (e) => e.isActive("bulletList"), run: (e) => e.chain().focus().toggleBulletList().run() },
    { label: "1.", title: "Numbered list", active: (e) => e.isActive("orderedList"), run: (e) => e.chain().focus().toggleOrderedList().run() },
  ],
  [
    { label: "Quote", title: "Blockquote", active: (e) => e.isActive("blockquote"), run: (e) => e.chain().focus().toggleBlockquote().run() },
    { label: "—", title: "Divider line", run: (e) => e.chain().focus().setHorizontalRule().run() },
  ],
  [{ label: "Link", title: "Add or remove link", active: (e) => e.isActive("link"), run: (e) => setLink(e) }],
  [
    { label: "Undo", title: "Undo (Ctrl/⌘+Z)", can: (e) => e.can().undo(), run: (e) => e.chain().focus().undo().run() },
    { label: "Redo", title: "Redo (Ctrl/⌘+Shift+Z)", can: (e) => e.can().redo(), run: (e) => e.chain().focus().redo().run() },
  ],
];

function setLink(editor: Editor) {
  if (editor.isActive("link")) {
    editor.chain().focus().unsetLink().run();
    return;
  }
  const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
  const url = window.prompt("Link URL (leave empty to remove)", prev || "https://");
  if (url === null) return;
  if (!url.trim()) return;
  editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
}

export function RichText({ initialHtml, onChange }: { initialHtml: string; onChange: (html: string) => void }) {
  const editor = useEditor(
    {
      immediatelyRender: false,
      /* toolbar must re-render on cursor/selection changes, not just edits —
         otherwise active states (Bold, H2…) freeze until the next keystroke */
      shouldRerenderOnTransaction: true,
      extensions: [
        /* StarterKit v3 bundles Link — configure it there (a separate
           Link extension registers a duplicate "link" and warns) */
        StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
        Placeholder.configure({ placeholder: "Write the story — headings, lists, quotes and links from the toolbar…" }),
      ],
      content: initialHtml || "<p></p>",
      onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    },
    []
  );

  return (
    <div className="rte">
      <div className="rte__bar" role="toolbar" aria-label="Text formatting">
        {GROUPS.map((group, gi) => (
          <div className="rte__group" role="group" key={gi}>
            {group.map((b) => {
              const isOn = editor && b.active ? b.active(editor) : false;
              const isCan = editor && b.can ? b.can(editor) : true;
              return (
                <button
                  key={b.label}
                  type="button"
                  className={`rte__btn${b.cls ? ` rte__btn--${b.cls}` : ""}${isOn ? " is-active" : ""}`}
                  title={b.title}
                  aria-label={b.title}
                  aria-pressed={b.active ? isOn : undefined}
                  disabled={!editor || !isCan}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor && b.run(editor)}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <EditorContent editor={editor} className="rte__content" />
    </div>
  );
}
