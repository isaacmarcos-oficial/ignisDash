import { Editor } from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PostCreate() {
  return (
    <div className="p-6 w-full lg:max-w-4xl md:max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <a href="/blog">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </a>
        <h1 className="text-3xl font-bold ">Criar Post</h1>
      </div>
      <div>
        <Editor />
      </div>
    </div>
  );
}
