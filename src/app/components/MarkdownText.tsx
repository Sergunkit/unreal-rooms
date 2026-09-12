import ReactMarkdown from 'react-markdown';

export function MarkdownText({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <span className="m-0 p-0">{children}</span>,
        em: ({ children }) => <em className="italic">{children}</em>,
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
