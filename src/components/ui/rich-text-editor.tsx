"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Button } from "./button"
import Image from "next/image";
import ICONS from "@/assets/icons";

interface RichTextEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  onImageUpload?: () => void;
  className?: string;
  minHeight?: string;
  showToolbar?: boolean;
  readOnly?: boolean;
}

export default function RichTextEditor({
  content = "",
  placeholder = "Write here...",
  onChange,
  onImageUpload,
  className = "",
  minHeight = "200px",
  showToolbar = true,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: `focus:outline-none p-3 sm:p-4 text-sm sm:text-[15px] leading-relaxed text-darkGray ${className}`,
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      editor.commands.focus("start");
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-grayBorder rounded-[10px]">
      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="tiptap-editor"
          data-placeholder={placeholder}
          style={{ maxHeight: '180px', overflowY: 'auto', minHeight }}
        />
        {editor?.isEmpty && !readOnly && !content && (
          <div className="absolute top-6 left-4 text-lightGray pointer-events-none z-10 text-sm sm:text-[15px]">
            {placeholder}
          </div>
        )}
      </div>

      {/* Formatting Toolbar */}
      {showToolbar && !readOnly && (
        <>
          <div className="p-2 sm:p-3 flex items-center gap-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={
                editor.isActive("bold")
                  ? "bg-grayBorder rounded-[5px] p-1 sm:p-2"
                  : "rounded-[5px] p-1 sm:p-2"
              }
            >
              <Image
                src={ICONS.bold}
                width={20}
                height={20}
                className="sm:w-6 sm:h-6"
                alt="bold"
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={
                editor.isActive("italic")
                  ? "bg-grayBorder rounded-[5px] p-1 sm:p-2"
                  : "rounded-[5px] p-1 sm:p-2"
              }
            >
              <Image
                src={ICONS.italic}
                width={20}
                height={20}
                className="sm:w-6 sm:h-6"
                alt="italic"
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={
                editor.isActive("underline")
                  ? "bg-grayBorder rounded-[5px] p-1 sm:p-2"
                  : "rounded-[5px] p-1 sm:p-2"
              }
            >
              <Image
                src={ICONS.underline}
                width={20}
                height={20}
                className="sm:w-6 sm:h-6"
                alt="underline"
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={
                editor.isActive("orderedList")
                  ? "bg-grayBorder rounded-[5px] p-1 sm:p-2"
                  : "rounded-[5px] p-1 sm:p-2"
              }
            >
              <Image
                src={ICONS.orderedList}
                alt="orderedList"
                width={20}
                height={20}
                className="sm:w-6 sm:h-6"
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={
                editor.isActive("bulletList")
                  ? "bg-grayBorder rounded-[5px] p-1 sm:p-2"
                  : "rounded-[5px] p-1 sm:p-2"
              }
            >
              <Image
                src={ICONS.bulletList}
                alt="bulletList"
                width={20}
                height={20}
                className="sm:w-6 sm:h-6"
              />
            </Button>
              <Button type="button" variant="ghost" className="border-r border-grayBorder p-2" />
            {/* Upload Media Button */}

            <div className="flex-1 " />
            {typeof onImageUpload === "function" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onImageUpload}
                disabled={!onImageUpload}
                className="p-1 sm:p-2"
              >
                <Image
                  src={ICONS.uploadMedia}
                  alt="uploadMedia"
                  width={20}
                  height={20}
                  className="sm:w-6 sm:h-6"
                />
              </Button>
            )}
          </div>

          {/* Line after controls */}
          <div className="border-t border-grayBorder mx-2 sm:mx-3" />
        </>
      )}
    </div>
  );
}
