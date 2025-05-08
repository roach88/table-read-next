import React from "react";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones, FileText, Book, Mic } from "lucide-react";

const AboutPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About AudioScript Alchemist</h1>
        <div className="prose prose-lg max-w-none mb-12">
          <p>
            AudioScript Alchemist is a powerful tool designed to transform
            written documents into spoken audio. Whether you're an actor
            practicing lines, a student reviewing study materials, or a
            professional preparing for a presentation, our platform helps bring
            your text to life.
          </p>
        </div>
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Document Uploads
                  </h3>
                  <p className="text-muted-foreground">
                    Upload your PDF, DOCX, and TXT files with ease. Our system
                    processes the text content while preserving formatting for
                    optimal speech conversion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md shrink-0">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Text-to-Speech</h3>
                  <p className="text-muted-foreground">
                    Powered by ElevenLabs' advanced text-to-speech technology,
                    we transform your documents into natural-sounding audio with
                    customizable voices and settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md shrink-0">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Script Detection
                  </h3>
                  <p className="text-muted-foreground">
                    Our intelligent system automatically recognizes when a
                    document is a script, enabling special features for actors
                    and performers to practice their lines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-md shrink-0">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Interactive Practice
                  </h3>
                  <p className="text-muted-foreground">
                    Practice scripts in an interactive session where you voice
                    one character and the AI reads the other parts, creating a
                    realistic rehearsal experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">Upload Your Document</h3>
              <p className="text-muted-foreground">
                Choose your file and let our system process it for speech
                conversion.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">Select Voice & Settings</h3>
              <p className="text-muted-foreground">
                Pick your preferred voice and adjust speed or other options.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium">Convert & Listen</h3>
              <p className="text-muted-foreground">
                Generate audio and listen or download the result.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
