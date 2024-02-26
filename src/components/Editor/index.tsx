import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import {
  RxFontBold,
  RxFontItalic,
  RxLink1,
  RxLinkBreak1,
  RxStrikethrough,
} from "react-icons/rx";
import StarterKit from "@tiptap/starter-kit";
import { BubbleButton } from "./BubbleButton";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";

type ContentChangeHandler = (content: string) => void;

export function Editor({ onContentChange, initialContent = "" }: {onContentChange: ContentChangeHandler, initialContent?: string})
{
  const [_linkURL, setLinkURL] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    onUpdate(editor) {
      editor.editor.getHTML
    },
    content: initialContent,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.commands.setContent(initialContent)

    const updateContent = () => {
      const content = editor.getHTML();
      onContentChange(content);
    };

    editor.on("update", updateContent);

    return () => {
      editor.off("update", updateContent);
    };
  }, [initialContent, editor]);

  useEffect(() => {
    if (!editor) return;

    const updateLinkURL = () => {
      if (editor.isActive("link")) {
        setLinkURL(editor.getAttributes("link").href);
      } else {
        setLinkURL("");
      }
    };

    editor.on("selectionUpdate", updateLinkURL);

    return () => {
      editor.off("selectionUpdate", updateLinkURL);
    };
  }, [editor]);

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
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
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

          <button
            className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-100"
            type="button"
            onClick={() =>
              editor.chain().focus().setParagraph().run()
            }
          >
            <img
              src="https://www.notion.so/images/blocks/text/en-US.png"
              alt="Text"
              className="w-12 border rounded border-zinc-50"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Texto</span>
              <span className="text-xs">
                Comece a escrever com texto sem formatação.
              </span>
            </div>
          </button>

          <button
            className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-100"
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <img
              src="https://www.notion.so/images/blocks/quote/en-US.png"
              alt="Quote"
              className="w-12 border rounded border-zinc-50"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Citação</span>
              <span className="text-xs">Insira uma citação</span>
            </div>
          </button>
        </FloatingMenu>
      )}
      {editor && (
        <BubbleMenu
          className="bg-zinc-100 shadow-xl border border-zinc-50 rounded-lg overflow-hidden flex divide-x divide-zinc-200"
          editor={editor}
        >
          
          <div className="flex items-center">
            <BubbleButton
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              data-active={editor.isActive("bold")}
            >
              <RxFontBold className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              data-active={editor.isActive("italic")}
            >
              <RxFontItalic className="w-4 h-4" />
            </BubbleButton>
            <BubbleButton
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              data-active={editor.isActive("strike")}
            >
              <RxStrikethrough className="w-4 h-4" />
            </BubbleButton>

            <div className="flex">
              {editor.isActive("link") && (
                <>
                  <BubbleButton
                    onClick={() => {
                      const currentUrl = editor.getAttributes("link").href;
                      const url = prompt("Editar o URL do Link:", currentUrl);
                      if (url) {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .setLink({ href: url })
                          .run();
                      }
                    }}
                  >
                    <RxLink1 className="w-4 h-4" />
                  </BubbleButton>

                  <BubbleButton
                    onClick={() => editor.chain().focus().unsetLink().run()}
                  >
                    <RxLinkBreak1 className="w-4 h-4" />
                  </BubbleButton>
                </>
              )}

              {/* Botão para Inserir Link, mostrado quando nenhum link está ativo */}
              {!editor.isActive("link") && (
                <BubbleButton
                  type="button"
                  onClick={() => {
                    const url = prompt("Insira o URL do Link:");
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                >
                  <RxLink1 className="w-4 h-4" />{" "}
                </BubbleButton>
              )}
            </div>

            
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}
