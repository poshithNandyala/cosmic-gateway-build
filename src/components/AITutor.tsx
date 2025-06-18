import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GoogleGenAI } from "@google/genai";


interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Astronomy Tutor. I can help you learn about space, explain celestial phenomena, and answer any questions about the universe. What would you like to explore today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<"simple" | "detailed">("simple");

  const quickQuestions = [
    "What causes meteor showers?",
    "How far is the ISS from Earth?",
    "What's a black hole?",
    "Why do planets orbit the sun?",
    "What are the phases of the moon?",
    "How are stars born?",
  ];

  const responses = {
    simple: {
      meteor:
        "Meteor showers happen when Earth passes through debris left by comets! These tiny pieces burn up in our atmosphere, creating beautiful streaks of light. It's like cosmic fireworks! 🌟",
      iss: "The International Space Station orbits about 408 kilometers (254 miles) above Earth. That's roughly the distance from New York to Boston, but straight up! 🚀",
      "black hole":
        "A black hole is like a cosmic vacuum cleaner so powerful that nothing can escape it - not even light! They form when massive stars collapse. Think of it as a point where gravity becomes super strong! 🕳️",
      orbit:
        "Planets orbit the sun because of gravity! The sun's massive size creates a gravitational pull that keeps planets moving in curved paths around it, like a ball on a string being swung in circles! 🌍",
      "moon phases":
        "Moon phases happen because we see different amounts of the moon lit up by the sun as it orbits Earth. It's like watching a ball with a flashlight - sometimes we see the whole lit side, sometimes just a sliver! 🌙",
      stars:
        "Stars are born in giant clouds of gas and dust called nebulae. When these clouds get squeezed together by gravity, they heat up and start nuclear fusion - that's when a star is born and begins to shine! ⭐",
    },
    detailed: {
      meteor:
        "Meteor showers occur when Earth's orbital path intersects with the debris trail of a comet. As comets approach the Sun, solar radiation causes volatile materials to sublimate, creating a trail of particles...",
      iss: "The International Space Station maintains an orbital altitude of approximately 408 kilometers (254 miles) above Earth's surface...",
      "black hole":
        "Black holes are regions of spacetime where gravitational effects become so strong that nothing—not even electromagnetic radiation such as light—can escape...",
      orbit:
        "Planetary orbits result from the balance between gravitational attraction and inertial motion. According to Newton's laws...",
      "moon phases":
        "Lunar phases result from the changing angular relationship between Earth, Moon, and Sun as the Moon orbits Earth with a period of approximately 29.5 days...",
      stars:
        "Stellar formation occurs within molecular clouds when gravitational instabilities cause regions of higher density to collapse...",
    },
  };

  
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    const lowerText = inputText.toLowerCase();
    const topicKey = Object.keys(responses[mode]).find((key) =>
      lowerText.includes(key)
    );
    let replyText = "";

    if (topicKey) {
      replyText = responses[mode][topicKey as keyof typeof responses.simple];
    } else {
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });
        const prompt = mode === "simple" 
          ? `Explain in one simple line about astronomy topic: ${inputText}`
          : `Provide a detailed scientific explanation about the astronomy topic: ${inputText}. Focus on technical details and scientific concepts.`;
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        replyText = response.text || "I'm still thinking about that one! Try asking it differently.";
      } catch (error) {
        replyText =
          "Sorry, I had trouble connecting to my knowledge base. Try again in a moment!";
      }
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: replyText,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };
  return (
    <div className="container mx-auto px-6 relative z-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            AI Astronomy Tutor
          </h2>
          <p className="text-xl text-gray-300">
            Your personal guide to understanding the cosmos
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-4">
              <Button
                variant={mode === "simple" ? "default" : "outline"}
                onClick={() => setMode("simple")}
                className={
                  mode === "simple" ? "bg-cyan-500 hover:bg-cyan-600" : ""
                }
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simple Mode
              </Button>
              <Button
                variant={mode === "detailed" ? "default" : "outline"}
                onClick={() => setMode("detailed")}
                className={
                  mode === "detailed" ? "bg-blue-500 hover:bg-blue-600" : ""
                }
              >
                <Bot className="w-4 h-4 mr-2" />
                Detailed Mode
              </Button>
            </div>
          </div>

          <Card className="mb-6 bg-black/30 border-cyan-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-cyan-400">
                <MessageCircle className="w-6 h-6" />
                <span>Chat with AI Tutor</span>
                <Badge
                  variant="outline"
                  className="border-cyan-400 text-cyan-400 ml-auto"
                >
                  {mode === "simple" ? "ELI5 Mode" : "Deep Dive Mode"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-black/20 rounded-lg">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isUser
                          ? "bg-cyan-500 text-white"
                          : "bg-white/10 text-gray-100 border border-white/20"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {!message.isUser && (
                          <Bot className="w-4 h-4 mt-1 text-cyan-400" />
                        )}
                        {message.isUser && <User className="w-4 h-4 mt-1" />}
                        <div>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-cyan-400" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything about space and astronomy..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                  onClick={sendMessage}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-3 border-white/20 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    <span className="text-sm text-gray-300">{question}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default AITutor;