
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, AlignLeft } from 'lucide-react';

interface SimpleRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write here...',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  }, [handleInput]);

  const formatText = useCallback((command: string) => {
    executeCommand(command);
  }, [executeCommand]);

  const insertList = useCallback(() => {
    executeCommand('insertUnorderedList');
  }, [executeCommand]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Rich Text Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        className={`w-full px-3 py-2.5 border border-gray-300 rounded-t-lg text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto ${
          isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''
        }`}
        style={{ 
          minHeight: '120px',
          maxHeight: '200px'
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      {/* Text Formatting Controls */}
      <div className="flex items-center gap-2 p-2 border-x border-b border-gray-300 rounded-b-lg bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors font-bold"
          title="Bold"
        >
          B
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors italic"
          title="Italic"
        >
          I
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors underline"
          title="Underline"
        >
          U
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertList}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors"
          title="Bullet List"
        >
          •
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('justifyLeft')}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-colors"
          title="Align Left"
        >
          ≡
        </Button>
      </div>
      
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] {
          outline: none;
        }
        
        [contenteditable] ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        [contenteditable] b, [contenteditable] strong {
          font-weight: bold;
        }
        
        [contenteditable] i, [contenteditable] em {
          font-style: italic;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default SimpleRichTextEditor;
