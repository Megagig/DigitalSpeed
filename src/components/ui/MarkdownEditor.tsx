'use client';

import { useState } from 'react';
import { FiCode, FiLink, FiList, FiBold, FiItalic, FiImage } from 'react-icons/fi';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  rows = 10,
}: MarkdownEditorProps) {
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  const handleTextareaRef = (ref: HTMLTextAreaElement | null) => {
    setTextareaRef(ref);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  const insertMarkdown = (markdownBefore: string, markdownAfter: string = '') => {
    if (!textareaRef) return;

    const start = selectionStart;
    const end = selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + markdownBefore + selectedText + markdownAfter + value.substring(end);
    
    onChange(newText);
    
    // Set focus back to textarea and restore cursor position
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        const newCursorPos = start + markdownBefore.length + selectedText.length + markdownAfter.length;
        textareaRef.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleBold = () => {
    insertMarkdown('**', '**');
  };

  const handleItalic = () => {
    insertMarkdown('*', '*');
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const selectedText = value.substring(selectionStart, selectionEnd);
      const linkText = selectedText || 'link text';
      insertMarkdown(`[${linkText}](${url})`);
    }
  };

  const handleList = () => {
    insertMarkdown('\n- ');
  };

  const handleCode = () => {
    const selectedText = value.substring(selectionStart, selectionEnd);
    if (selectedText.includes('\n')) {
      // Code block for multi-line
      insertMarkdown('```\n', '\n```');
    } else {
      // Inline code for single line
      insertMarkdown('`', '`');
    }
  };

  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const alt = prompt('Enter image description:') || '';
      insertMarkdown(`![${alt}](${url})`);
    }
  };

  return (
    <div className="markdown-editor border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-700 p-2 border-b border-gray-300 dark:border-gray-600 flex space-x-2">
        <button
          type="button"
          onClick={handleBold}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Bold"
        >
          <FiBold />
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Italic"
        >
          <FiItalic />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Link"
        >
          <FiLink />
        </button>
        <button
          type="button"
          onClick={handleList}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="List"
        >
          <FiList />
        </button>
        <button
          type="button"
          onClick={handleCode}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Code"
        >
          <FiCode />
        </button>
        <button
          type="button"
          onClick={handleImage}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Image"
        >
          <FiImage />
        </button>
      </div>
      <textarea
        ref={handleTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        rows={rows}
        placeholder={placeholder}
        className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />
      <div className="bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600">
        <p>
          Supports Markdown: <strong>**bold**</strong>, <em>*italic*</em>,{' '}
          <code>`code`</code>, [link](url), ![image](url), and more.
        </p>
      </div>
    </div>
  );
}
