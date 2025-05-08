import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="py-20 text-center space-y-6">
      <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
        <Headphones className="h-10 w-10 text-primary" />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        <span className="text-gradient">Transform Your Documents</span>
        <br /> Into Spoken Audio
      </h1>

      <p className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
        Upload PDF, DOCX, or TXT files and convert them to natural-sounding
        speech. Practice scripts interactively with AI line readings.
      </p>

      <div className="pt-6 flex flex-wrap gap-4 justify-center">
        <Link href="/convert">
          <Button size="lg" className="px-8">
            Get Started
          </Button>
        </Link>
        <Link href="/about">
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
