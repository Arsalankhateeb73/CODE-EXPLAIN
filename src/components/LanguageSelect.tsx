"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
] as const;

type LanguageSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Language</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-0 ring-2 ring-transparent focus:ring-2 focus:ring-purple-500/50 focus:bg-white focus:text-gray-900 transition-all duration-300 hover:ring-2 hover:ring-blue-500/50 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/20 before:via-pink-500/20 before:to-orange-500/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 data-[state=open]:bg-white data-[state=open]:text-gray-900 data-[state=open]:shadow-lg">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg">
          {languages.map((language) => (
            <SelectItem
              key={language.value}
              value={language.value}
              className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer text-gray-900"
            >
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
