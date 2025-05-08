import React, { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isScriptFormat } from "@/services/elevenlabs";

interface DocumentPreviewProps {
  content: string;
  isLoading: boolean;
  currentLine?: number;
  isScript?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  content,
  isLoading,
  currentLine = -1,
  isScript,
}) => {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Detect if content is a script format if not explicitly provided
  const isScriptContent =
    isScript !== undefined
      ? isScript
      : content
        ? isScriptFormat(content)
        : false;

  // Auto-scroll to the current line
  useEffect(() => {
    if (
      currentLine >= 0 &&
      lineRefs.current[currentLine] &&
      scrollAreaRef.current
    ) {
      lineRefs.current[currentLine]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLine]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  const lines = content ? content.split("\n") : [];

  // Format a line for script display
  const formatScriptLine = (line: string) => {
    // Simple regex for "Character: Dialog" format
    const match = line.match(/^([A-Za-z\s.]+):\s*(.+)/);

    if (match) {
      const [_, character, dialog] = match;
      return (
        <>
          <span className="font-bold text-primary">{character}:</span>{" "}
          <span>{dialog}</span>
        </>
      );
    }

    // Check for common script headers (all caps with no colon)
    if (line.match(/^[A-Z][A-Z\s]+$/) && !line.includes(":")) {
      return <span className="font-semibold uppercase">{line}</span>;
    }

    return line;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ScrollArea className="h-[500px] pr-4" ref={scrollAreaRef}>
          {content ? (
            <div className="space-y-2">
              {lines.map((line, index) => (
                <div
                  key={index}
                  ref={(el) => (lineRefs.current[index] = el)}
                  className={`px-3 py-2 rounded-md transition-colors duration-300 ${
                    currentLine === index
                      ? "bg-primary/15 font-medium border-l-4 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {isScriptContent ? formatScriptLine(line) : line || <br />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-4">
              No document content to display
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
