import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface DocumentActionsProps {
  onConvert: () => void;
  onStartInteractive?: () => void;
  isScript: boolean;
  isConverting: boolean;
  voiceId: string;
  speed: number;
  onVoiceChange: (value: string) => void;
  onSpeedChange: (value: number[]) => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  onConvert,
  onStartInteractive,
  isScript,
  isConverting,
  voiceId,
  speed,
  onVoiceChange,
  onSpeedChange,
}) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Voice</h3>
          <Select value={voiceId} onValueChange={onVoiceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="21m00Tcm4TlvDq8ikWAM">Rachel</SelectItem>
              <SelectItem value="AZnzlk1XvdvUeBnXmlld">Domi</SelectItem>
              <SelectItem value="EXAVITQu4vr4xnSDxMaL">Bella</SelectItem>
              <SelectItem value="MF3mGyEYCl7XYWbV9V6O">Elli</SelectItem>
              <SelectItem value="TxGEqnHWrfWFTfGW9XjX">Josh</SelectItem>
              <SelectItem value="VR6AewLTigWG4xSOukaG">Arnold</SelectItem>
              <SelectItem value="pNInz6obpgDQGcFmaJgB">Adam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="font-medium">Speed</h3>
            <span className="text-sm text-muted-foreground">
              {speed.toFixed(1)}x
            </span>
          </div>
          <Slider
            defaultValue={[1.0]}
            value={[speed]}
            onValueChange={onSpeedChange}
            min={0.5}
            max={2.0}
            step={0.1}
          />
        </div>

        <div className="pt-2">
          <Button
            className="w-full mb-3"
            onClick={onConvert}
            disabled={isConverting}
          >
            {isConverting ? "Converting..." : "Convert to Audio"}
          </Button>

          {isScript && onStartInteractive && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onStartInteractive}
              disabled={isConverting}
            >
              Interactive Script Practice
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentActions;
