import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface Character {
  name: string;
  lines: number[];
}

interface ScriptLineProps {
  character: string;
  text: string;
  isUserLine: boolean;
  isCurrentLine: boolean;
  isCompleted: boolean;
  onReadyToSpeak?: () => void;
}

const ScriptLine: React.FC<ScriptLineProps> = ({
  character,
  text,
  isUserLine,
  isCurrentLine,
  isCompleted,
  onReadyToSpeak,
}) => {
  return (
    <div
      className={`p-4 rounded-md mb-4 transition-all ${
        isCurrentLine
          ? "bg-primary/10 border-l-4 border-primary"
          : isCompleted
            ? "bg-muted/50"
            : "bg-card"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`font-bold ${isUserLine ? "text-primary" : "text-muted-foreground"}`}
        >
          {character}:
        </span>
        {isUserLine && isCurrentLine && (
          <Button size="sm" variant="default" onClick={onReadyToSpeak}>
            I'm Ready
          </Button>
        )}
      </div>
      <p className={isCompleted ? "text-muted-foreground" : ""}>{text}</p>
    </div>
  );
};

interface ScriptPracticeProps {
  content: string;
  onPlayAILine: (text: string, callback: () => void) => void;
}

const ScriptPractice: React.FC<ScriptPracticeProps> = ({
  content,
  onPlayAILine,
}) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [parsedScript, setParsedScript] = useState<
    Array<{ character: string; text: string }>
  >([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [isPracticeStarted, setIsPracticeStarted] = useState<boolean>(false);

  // Parse script to extract characters and lines
  useEffect(() => {
    const lines = content.split("\n").filter((line) => line.trim());
    const scriptLines: Array<{ character: string; text: string }> = [];
    const characterMap: Record<string, number[]> = {};

    lines.forEach((line, index) => {
      // Basic script format detection: "CHARACTER: Line text"
      const match = line.match(/^([A-Za-z\s.]+):\s*(.*)/);
      if (match) {
        const characterName = match[1].trim();
        const lineText = match[2].trim();

        scriptLines.push({ character: characterName, text: lineText });

        if (!characterMap[characterName]) {
          characterMap[characterName] = [];
        }
        characterMap[characterName].push(index);
      } else {
        // Handle stage directions or other text
        scriptLines.push({ character: "Direction", text: line.trim() });
      }
    });

    setParsedScript(scriptLines);

    const chars = Object.keys(characterMap).map((name) => ({
      name,
      lines: characterMap[name],
    }));

    setCharacters(chars);
  }, [content]);

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character);
  };

  const startPractice = () => {
    if (!selectedCharacter) {
      toast({
        title: "Please select a character",
        description: "You need to select a character to begin practice.",
        variant: "destructive",
      });
      return;
    }

    setCurrentLineIndex(0);
    setCompletedLines([]);
    setIsPracticeStarted(true);

    // If first line is not the user's, play it
    handleNextLine();
  };

  const handleReadyToSpeak = () => {
    // Mark current line as completed
    setCompletedLines((prev) => [...prev, currentLineIndex]);

    // Move to next line
    setCurrentLineIndex((prev) => prev + 1);

    // Process next line
    setTimeout(() => {
      handleNextLine();
    }, 500);
  };

  const handleNextLine = () => {
    // If we've reached the end of the script
    if (currentLineIndex >= parsedScript.length) {
      toast({
        title: "Practice completed!",
        description: "You've completed the script practice session.",
      });
      return;
    }

    const currentLine = parsedScript[currentLineIndex];
    const isUserLine = currentLine.character === selectedCharacter;

    // If it's not the user's line, the AI should read it
    if (!isUserLine) {
      onPlayAILine(currentLine.text, () => {
        // Mark this line as completed
        setCompletedLines((prev) => [...prev, currentLineIndex]);
        // Move to next line
        setCurrentLineIndex((prev) => prev + 1);
        // Process next line
        setTimeout(() => {
          handleNextLine();
        }, 500);
      });
    }
  };

  return (
    <Card className="w-full">
      {!isPracticeStarted ? (
        <>
          <CardHeader>
            <CardTitle>Interactive Script Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Select Your Character</h3>
              <Select
                value={selectedCharacter}
                onValueChange={handleCharacterSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a character" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map((character) => (
                    <SelectItem key={character.name} value={character.name}>
                      {character.name} ({character.lines.length} lines)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="pt-2">
              <Button
                className="w-full"
                onClick={startPractice}
                disabled={!selectedCharacter}
              >
                Begin Practice
              </Button>
            </div>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Practicing as {selectedCharacter}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {parsedScript.map((line, index) => {
                const isUserLine = line.character === selectedCharacter;
                const isCurrentLine = currentLineIndex === index;
                const isCompleted = completedLines.includes(index);

                return (
                  <ScriptLine
                    key={index}
                    character={line.character}
                    text={line.text}
                    isUserLine={isUserLine}
                    isCurrentLine={isCurrentLine}
                    isCompleted={isCompleted}
                    onReadyToSpeak={handleReadyToSpeak}
                  />
                );
              })}
            </ScrollArea>

            <Separator className="my-4" />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsPracticeStarted(false)}
            >
              Exit Practice Mode
            </Button>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ScriptPractice;
