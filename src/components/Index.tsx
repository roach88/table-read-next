import React from "react";
import Layout from "@/components/Layout/Layout";
import Hero from "@/components/Home/Hero";
import FeatureCard from "@/components/Features/FeatureCard";
import { Headphones, FileText, Book, Mic } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            title="Upload Documents"
            description="Easily upload PDF, DOCX, or TXT files to the platform."
            icon={<FileText className="h-10 w-10" />}
          />
          <FeatureCard
            title="Convert to Audio"
            description="Transform your documents into natural-sounding speech."
            icon={<Headphones className="h-10 w-10" />}
          />
          <FeatureCard
            title="Script Detection"
            description="Automatic detection of scripts for interactive practice."
            icon={<Book className="h-10 w-10" />}
          />
          <FeatureCard
            title="Interactive Practice"
            description="Practice scripts by speaking your character's lines."
            icon={<Mic className="h-10 w-10" />}
          />
        </div>
      </div>
      <div className="py-12 bg-primary/5 rounded-lg p-8 my-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to bring your documents to life?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Transform your documents into audio and practice your scripts with
            just a few clicks.
          </p>
          <a
            href="/convert"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
