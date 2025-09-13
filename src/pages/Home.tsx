import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Brain, 
  BarChart3, 
  Trophy,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Upload PDFs",
      description: "Upload your PDF documents and generate flashcards automatically with AI",
      icon: Upload,
      link: "/upload",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Upload Now",
      delay: 0.1
    },
    {
      title: "View Flashcards",
      description: "Browse and manage all your created flashcards in one organized place",
      icon: FileText,
      link: "/dashboard#flashcards",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "View All",
      delay: 0.2
    },
    {
      title: "Study Sessions",
      description: "Practice with your flashcards using advanced spaced repetition techniques",
      icon: BookOpen,
      link: "/study-session",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Start Studying",
      delay: 0.3
    },
    {
      title: "Practice Quiz",
      description: "Test your knowledge with interactive quizzes and track your progress",
      icon: Brain,
      link: "/quiz",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "Take Quiz",
      delay: 0.4
    },
    {
      title: "Progress Dashboard",
      description: "Track your learning progress, study streaks, and performance metrics",
      icon: BarChart3,
      link: "/dashboard",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "View Stats",
      delay: 0.5
    },
    {
      title: "Achievements",
      description: "Unlock badges and achievements as you progress in your learning journey",
      icon: Trophy,
      link: "/dashboard",
      gradient: "from-[#ff94ff] to-[#0166f8]",
      hoverGradient: "from-[#ff94ff]/90 to-[#0166f8]/90",
      buttonText: "View Achievements",
      delay: 0.6
    }
  ];

  return (
    <div className="min-h-screen relative bg-white">
      {/* Clean white background */}
      <div className="fixed inset-0 -z-10 bg-white" />
      
      <div className="relative z-10">
        <Header showBackButton={false} showLogoutButton={true} />
      
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Learning</span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ paddingBottom: '0.2em' }}
            >
              Welcome to Cognita
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your intelligent learning companion. Upload PDFs, create flashcards, 
              and master any subject with smart study sessions powered by AI.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                onClick={() => navigate('/upload')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
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
          </motion.div>

          {/* Getting Started Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Card className="max-w-6xl mx-auto bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Quick Start Guide</span>
                </motion.div>
                <CardTitle className="text-3xl font-bold mb-4">Getting Started</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Follow these simple steps to begin your AI-powered learning journey
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      step: "1",
                      title: "Upload Your PDFs",
                      description: "Start by uploading your PDF documents. Our AI will automatically extract key information and generate intelligent flashcards.",
                      icon: Upload,
                      gradient: "from-blue-500 to-cyan-500"
                    },
                    {
                      step: "2", 
                      title: "Review & Customize",
                      description: "Check the generated flashcards and make any adjustments to questions and answers to match your learning style.",
                      icon: Target,
                      gradient: "from-purple-500 to-pink-500"
                    },
                    {
                      step: "3",
                      title: "Start Learning",
                      description: "Begin studying with our intelligent system that adapts to your learning pace and tracks your progress.",
                      icon: TrendingUp,
                      gradient: "from-emerald-500 to-teal-500"
                    }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    >
                      <motion.div 
                        className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <step.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-lg font-bold text-primary">{step.step}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-primary/20 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Ready to transform your learning?</span>
            </div>
            <p className="text-2xl font-bold mb-8 text-foreground">
              Let's get started on your journey to mastery!
            </p>
            <Button 
              size="lg" 
              className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
              onClick={() => navigate('/upload')}
            >
              <span className="flex items-center gap-2">
                Start Learning Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;