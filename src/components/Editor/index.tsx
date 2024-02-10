import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { initialContent } from "./initialContent";
import {
  RxChevronDown,
  RxFontBold,
  RxFontItalic,
  RxStrikethrough,
} from "react-icons/rx";
import { BubbleButton } from "./BubbleButton";

export function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  return (
    <div>
      <EditorContent
        className="prose prose-zinc lg:prose-xl max-w-none"
        editor={editor}
      />
      {editor && (
        <FloatingMenu
          className="bg-zinc-50 shadow-xl border border-zinc-50 rounded-lg overflow-hidden flex flex-col py-2 gap-1 px-1"
          editor={editor}
          shouldShow={({ state }) => {
            const { $from } = state.selection;

            const currentLineText = $from.nodeBefore?.textContent;

            return currentLineText === "/";
          }}
        >
          <button
            className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-100"
            onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
          >
            <img
              src="https://www.notion.so/images/blocks/header.57a7576a.png"
              alt="text-h1"
              className="w-12 border rounded border-zinc-50"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Título 2</span>
              <span className="text-xs">Título de seção médio</span>
            </div>
          </button>

          <button className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-100">
            <img
              src="https://www.notion.so/images/blocks/text/en-US.png"
              alt="Text"
              className="w-12 border rounded border-zinc-50"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Texto</span>
              <span className="text-xs">Comece a escrever com texto sem formatação.</span>
            </div>
          </button>
        </FloatingMenu>
      )}
      {editor && (
        <BubbleMenu
          className="bg-zinc-100 shadow-xl border border-zinc-50 rounded-lg overflow-hidden flex divide-x divide-zinc-200"
          editor={editor}
        >
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive("bold")}
          >
            Text
            <RxChevronDown className="w-4 h-4" />
          </BubbleButton>
          <div className="flex items-center">
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              data-active={editor.isActive("bold")}
            >
              <RxFontBold className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              data-active={editor.isActive("italic")}
            >
              <RxFontItalic className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              data-active={editor.isActive("strike")}
            >
              <RxStrikethrough className="w-4 h-4" />
            </BubbleButton>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}
