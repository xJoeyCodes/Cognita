import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, BookOpen, Zap, Star, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const [isHovering, setIsHovering] = useState(false);

  const features = [
    {
      title: "Intelligent Generation",
      description: "Advanced technology analyzes your PDFs and creates intelligent flashcards and quizzes automatically",
      icon: Brain,
      link: "/auth",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Learn More",
      delay: 0.1
    },
    {
      title: "Smarter Memory",
      description: "Spaced repetition keeps knowledge in your brain for the long run",
      icon: Zap,
      link: "/auth",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Learn More",
      delay: 0.2
    },
    {
      title: "Learn Your Way",
      description: "Quizzes, flashcards, or both — tailor studying to your style",
      icon: BookOpen,
      link: "/auth",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Learn More",
      delay: 0.3
    },
    {
      title: "Easy PDF Upload",
      description: "Drag and drop your PDFs for instant processing. Supports all major document formats",
      icon: Upload,
      link: "/auth",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Learn More",
      delay: 0.4
    },
    {
      title: "Export Options",
      description: "Export your flashcards to Anki, Quizlet, or CSV format for use in other platforms",
      icon: FileText,
      link: "/auth",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Learn More",
      delay: 0.5
    },
    {
      title: "Audio Support",
      description: "Text-to-speech functionality makes learning accessible and supports auditory learners",
      icon: Star,
      link: "/auth",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Learn More",
      delay: 0.6
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border/50 bg-white backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/assets/logo.png" 
              alt="Cognita Logo" 
              className="h-12 w-10 object-contain" 
            />
            <h1 className="text-xl font-bold text-black">Cognita</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/auth" className="text-gray-600 hover:text-black transition-colors">
              Sign In
            </Link>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 leading-tight text-black">
               Turn Any PDF into{" "}
              <span className="bg-gradient-to-r from-[#ff94ff] to-[#0166f8] bg-clip-text text-transparent">Smart Flashcards Instantly</span>{" "}
              with AI
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload your notes, textbooks, or slides and let AI transform them into interactive flashcards and quizzes. 
              Learn faster, remember longer, and study on your terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#ff94ff] to-[#0166f8] hover:from-[#ff94ff]/90 hover:to-[#0166f8]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                asChild
              >
                <Link to="/upload">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload & Learn Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white transition-all duration-300" asChild>
                <Link to="/demo">
                  <Star className="mr-2 h-5 w-5" />
                  See Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-black">Why Choose Cognita?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our intelligent platform makes studying more efficient and effective than ever before.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1), duration: 0.6 }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="group cursor-pointer"
                >
                  <Card className="h-full group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 bg-white border border-gray-200/50 hover:border-primary/40 relative overflow-hidden group-hover:bg-white rounded-2xl">
                    {/* Subtle gradient background on hover */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
                      whileHover={{ opacity: 0.08 }}
                    />
                    
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div 
                          className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-md group-hover:shadow-lg transition-all duration-300`}
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge variant="outline" className="text-xs group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </motion.div>
                      </div>
                      <motion.div
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </CardTitle>
                      </motion.div>
                      <CardDescription className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0 relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          asChild 
                          className={`w-full group/btn bg-gradient-to-r ${feature.gradient} hover:${feature.hoverGradient} text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg`}
                        >
                          <Link to={feature.link} className="flex items-center justify-center gap-2 py-2.5">
                            <motion.span
                              whileHover={{ x: -1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {feature.buttonText}
                            </motion.span>
                            <motion.div
                              whileHover={{ x: 2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          </Link>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 text-black">Ready to Study Smarter?</h3>
            <p className="text-gray-600 mb-8">
              Join students everywhere who are using Cognita to learn faster, retain more, and ace their exams.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-[#ff94ff] to-[#0166f8] hover:from-[#ff94ff]/90 hover:to-[#0166f8]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300" asChild>
              <Link to="/auth">
                Start Learning Today
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2025 Cognita. Built to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;