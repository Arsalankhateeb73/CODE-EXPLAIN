"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Code, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import LanguageSelect from "@/components/LanguageSelect";
import CodeEditor from "@/components/CodeEditor";

type ExplainResult = {
  explanation: string;
};

export default function Home() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) {
      toast.error("Please paste some code first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to explain code");
      }

      const result: ExplainResult = await response.json();
      setExplanation(result);
      toast.success("Code analysis complete!");
    } catch (error) {
      console.error("Explain error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to explain code");
    } finally {
      setLoading(false);
    }
  };

  const getLanguageDisplayName = (lang: string) => {
    const languageMap: Record<string, string> = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      java: "Java",
      cpp: "C++",
      go: "Go",
      rust: "Rust",
    };
    return languageMap[lang] || lang;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <Code className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Code Explainer
          </h1>
        </div>
        <p className="text-gray-300 text-sm md:text-base mb-4">
          Get instant insights and error analysis for your code
        </p>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 text-blue-200 shadow-lg">
          <Sparkles className="w-3 h-3 mr-1" />
          {getLanguageDisplayName(language)}
        </Badge>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Language Select - Centered */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 w-full max-w-md">
            <CardContent className="p-4">
              <LanguageSelect value={language} onChange={setLanguage} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Code Editor - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Code Editor */}
          <Card className="bg-gray-900/80 backdrop-blur-md border-gray-700/50 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
            <CardHeader className="pb-3 border-b border-gray-700/50">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-200">
                <Code className="w-5 h-5 text-blue-400" />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CodeEditor
                value={code}
                language={language}
                onChange={setCode}
                errors={[]}
                height={400}
              />
            </CardContent>
          </Card>

          {/* Explain Button - Centered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 w-full max-w-md">
              <CardContent className="p-6">
                <Button
                  onClick={handleExplain}
                  disabled={loading || !code.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Explain Code
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Code Analysis - Multiple Boxes */}
        <AnimatePresence>
          {explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Main Analysis Box */}
              <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md border-blue-500/30 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
                <CardHeader className="border-b border-blue-500/30">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-200">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Code Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {explanation?.explanation ? (
                    <div className="space-y-4">
                      {/* Main Analysis Content */}
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="space-y-2">
                          {explanation.explanation.split('\n').map((line, index) => {
                            if (!line.trim()) return null;
                            
                            // Enhanced filtering to exclude errors and insights
                            const lowerLine = line.toLowerCase();
                            if (lowerLine.includes("❌") || 
                                lowerLine.includes("error") || 
                                lowerLine.includes("bug") ||
                                lowerLine.includes("issue") ||
                                lowerLine.includes("problem") ||
                                lowerLine.includes("fail") ||
                                lowerLine.includes("invalid") ||
                                lowerLine.includes("wrong") ||
                                lowerLine.includes("💡") || 
                                lowerLine.includes("improvement") || 
                                lowerLine.includes("suggestion") ||
                                lowerLine.includes("optimization") ||
                                lowerLine.includes("better") ||
                                lowerLine.includes("recommend") ||
                                lowerLine.includes("consider") ||
                                lowerLine.includes("enhance") ||
                                lowerLine.includes("good") ||
                                lowerLine.includes("could") ||
                                lowerLine.includes("should") ||
                                lowerLine.includes("might") ||
                                lowerLine.includes("would") ||
                                lowerLine.includes("try") ||
                                lowerLine.includes("instead") ||
                                lowerLine.includes("alternative") ||
                                lowerLine.includes("option") ||
                                lowerLine.includes("approach") ||
                                lowerLine.includes("method") ||
                                lowerLine.includes("technique") ||
                                lowerLine.includes("practice") ||
                                lowerLine.includes("tip") ||
                                lowerLine.includes("advice") ||
                                lowerLine.includes("note") ||
                                lowerLine.includes("remember") ||
                                lowerLine.includes("ensure") ||
                                lowerLine.includes("make sure") ||
                                lowerLine.includes("be careful") ||
                                lowerLine.includes("avoid") ||
                                lowerLine.includes("prevent") ||
                                lowerLine.includes("fix") ||
                                lowerLine.includes("correct") ||
                                lowerLine.includes("update") ||
                                lowerLine.includes("change") ||
                                lowerLine.includes("modify") ||
                                lowerLine.includes("refactor") ||
                                lowerLine.includes("improve") ||
                                lowerLine.includes("optimize") ||
                                lowerLine.includes("enhance") ||
                                lowerLine.includes("upgrade") ||
                                lowerLine.includes("modernize") ||
                                lowerLine.includes("simplify") ||
                                lowerLine.includes("clarify") ||
                                lowerLine.includes("explain") ||
                                lowerLine.includes("document") ||
                                lowerLine.includes("comment") ||
                                lowerLine.includes("test") ||
                                lowerLine.includes("validate") ||
                                lowerLine.includes("check") ||
                                lowerLine.includes("verify")) {
                              return null;
                            }
                            
                            return (
                              <div key={index} className="text-sm leading-relaxed text-gray-200">
                                {line.trim()}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Code Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <div className="text-xs text-blue-300 mb-1">Language</div>
                          <div className="text-sm font-medium text-white">{getLanguageDisplayName(language)}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <div className="text-xs text-blue-300 mb-1">Lines of Code</div>
                          <div className="text-sm font-medium text-white">{code.split('\n').filter(line => line.trim()).length}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <div className="text-xs text-blue-300 mb-1">Analysis Points</div>
                          <div className="text-sm font-medium text-white">{explanation.explanation.split('\n').filter(line => line.trim()).length}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No analysis available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Errors Box */}
              {explanation?.explanation && (
                (() => {
                  const errorLines = explanation.explanation.split('\n').filter(line => 
                    line.trim() && (
                      line.toLowerCase().includes("❌") || 
                      line.toLowerCase().includes("error") || 
                      line.toLowerCase().includes("bug") ||
                      line.toLowerCase().includes("issue") ||
                      line.toLowerCase().includes("problem") ||
                      line.toLowerCase().includes("fail") ||
                      line.toLowerCase().includes("invalid") ||
                      line.toLowerCase().includes("wrong")
                    )
                  );
                  return errorLines.length > 0 ? (
                    <Card className="bg-gradient-to-br from-red-900/50 to-pink-900/50 backdrop-blur-md border-red-500/30 shadow-2xl hover:shadow-red-500/25 transition-all duration-300">
                      <CardHeader className="border-b border-red-500/30">
                        <CardTitle className="text-lg flex items-center gap-2 text-red-200">
                          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white text-sm">⚠️</span>
                          </div>
                          Errors & Issues Found
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
                          <div className="space-y-3">
                            {explanation.explanation.split('\n').map((line, index) => {
                              if (!line.trim()) return null;
                              
                              const lowerLine = line.toLowerCase();
                              if (lowerLine.includes("❌") || 
                                  lowerLine.includes("error") || 
                                  lowerLine.includes("bug") ||
                                  lowerLine.includes("issue") ||
                                  lowerLine.includes("problem") ||
                                  lowerLine.includes("fail") ||
                                  lowerLine.includes("invalid") ||
                                  lowerLine.includes("wrong")) {
                                return (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <span className="text-red-400 text-lg">❌</span>
                                    <div className="text-sm leading-relaxed text-red-300 font-medium flex-1">
                                      {line.trim()}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null;
                })()
              )}

              {/* Insights Box */}
              {explanation?.explanation && (
                (() => {
                  const insightLines = explanation.explanation.split('\n').filter(line => 
                    line.trim() && (
                      line.toLowerCase().includes("💡") || 
                      line.toLowerCase().includes("improvement") || 
                      line.toLowerCase().includes("suggestion") ||
                      line.toLowerCase().includes("optimization") ||
                      line.toLowerCase().includes("better") ||
                      line.toLowerCase().includes("recommend") ||
                      line.toLowerCase().includes("consider") ||
                      line.toLowerCase().includes("enhance") ||
                      line.toLowerCase().includes("good") ||
                      line.toLowerCase().includes("could") ||
                      line.toLowerCase().includes("should") ||
                      line.toLowerCase().includes("might") ||
                      line.toLowerCase().includes("would") ||
                      line.toLowerCase().includes("try") ||
                      line.toLowerCase().includes("instead") ||
                      line.toLowerCase().includes("alternative") ||
                      line.toLowerCase().includes("option") ||
                      line.toLowerCase().includes("approach") ||
                      line.toLowerCase().includes("method") ||
                      line.toLowerCase().includes("technique") ||
                      line.toLowerCase().includes("practice") ||
                      line.toLowerCase().includes("tip") ||
                      line.toLowerCase().includes("advice") ||
                      line.toLowerCase().includes("note") ||
                      line.toLowerCase().includes("remember") ||
                      line.toLowerCase().includes("ensure") ||
                      line.toLowerCase().includes("make sure") ||
                      line.toLowerCase().includes("be careful") ||
                      line.toLowerCase().includes("avoid") ||
                      line.toLowerCase().includes("prevent") ||
                      line.toLowerCase().includes("fix") ||
                      line.toLowerCase().includes("correct") ||
                      line.toLowerCase().includes("update") ||
                      line.toLowerCase().includes("change") ||
                      line.toLowerCase().includes("modify") ||
                      line.toLowerCase().includes("refactor") ||
                      line.toLowerCase().includes("improve") ||
                      line.toLowerCase().includes("optimize") ||
                      line.toLowerCase().includes("enhance") ||
                      line.toLowerCase().includes("upgrade") ||
                      line.toLowerCase().includes("modernize") ||
                      line.toLowerCase().includes("simplify") ||
                      line.toLowerCase().includes("clarify") ||
                      line.toLowerCase().includes("explain") ||
                      line.toLowerCase().includes("document") ||
                      line.toLowerCase().includes("comment") ||
                      line.toLowerCase().includes("test") ||
                      line.toLowerCase().includes("validate") ||
                      line.toLowerCase().includes("check") ||
                      line.toLowerCase().includes("verify")
                    )
                  );
                  return insightLines.length > 0 ? (
                    <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-md border-green-500/30 shadow-2xl hover:shadow-green-500/25 transition-all duration-300">
                      <CardHeader className="border-b border-green-500/30">
                        <CardTitle className="text-lg flex items-center gap-2 text-green-200">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-sm">💡</span>
                          </div>
                          Insights & Improvements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                          <div className="space-y-3">
                            {explanation.explanation.split('\n').map((line, index) => {
                              if (!line.trim()) return null;
                              
                              const lowerLine = line.toLowerCase();
                              if (lowerLine.includes("💡") || 
                                  lowerLine.includes("improvement") || 
                                  lowerLine.includes("suggestion") ||
                                  lowerLine.includes("optimization") ||
                                  lowerLine.includes("better") ||
                                  lowerLine.includes("recommend") ||
                                  lowerLine.includes("consider") ||
                                  lowerLine.includes("enhance") ||
                                  lowerLine.includes("good") ||
                                  lowerLine.includes("could") ||
                                  lowerLine.includes("should") ||
                                  lowerLine.includes("might") ||
                                  lowerLine.includes("would") ||
                                  lowerLine.includes("try") ||
                                  lowerLine.includes("instead") ||
                                  lowerLine.includes("alternative") ||
                                  lowerLine.includes("option") ||
                                  lowerLine.includes("approach") ||
                                  lowerLine.includes("method") ||
                                  lowerLine.includes("technique") ||
                                  lowerLine.includes("practice") ||
                                  lowerLine.includes("tip") ||
                                  lowerLine.includes("advice") ||
                                  lowerLine.includes("note") ||
                                  lowerLine.includes("remember") ||
                                  lowerLine.includes("ensure") ||
                                  lowerLine.includes("make sure") ||
                                  lowerLine.includes("be careful") ||
                                  lowerLine.includes("avoid") ||
                                  lowerLine.includes("prevent") ||
                                  lowerLine.includes("fix") ||
                                  lowerLine.includes("correct") ||
                                  lowerLine.includes("update") ||
                                  lowerLine.includes("change") ||
                                  lowerLine.includes("modify") ||
                                  lowerLine.includes("refactor") ||
                                  lowerLine.includes("improve") ||
                                  lowerLine.includes("optimize") ||
                                  lowerLine.includes("enhance") ||
                                  lowerLine.includes("upgrade") ||
                                  lowerLine.includes("modernize") ||
                                  lowerLine.includes("simplify") ||
                                  lowerLine.includes("clarify") ||
                                  lowerLine.includes("explain") ||
                                  lowerLine.includes("document") ||
                                  lowerLine.includes("comment") ||
                                  lowerLine.includes("test") ||
                                  lowerLine.includes("validate") ||
                                  lowerLine.includes("check") ||
                                  lowerLine.includes("verify")) {
                                return (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                    <span className="text-green-400 text-lg">💡</span>
                                    <div className="text-sm leading-relaxed text-green-300 italic flex-1">
                                      {line.trim()}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null;
                })()
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}