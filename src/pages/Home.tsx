import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Brain, 
  BarChart3, 
  Settings,
  User,
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";

const Home = () => {
  const features = [
    {
      title: "Upload PDFs",
      description: "Upload your PDF documents and generate AI-powered flashcards automatically",
      icon: Upload,
      link: "/upload",
      color: "shadow-blue/20",
      buttonText: "Upload Now"
    },
    {
      title: "View Flashcards",
      description: "Browse and manage all your created flashcards in one place",
      icon: FileText,
      link: "/dashboard",
      color: "shadow-green/20",
      buttonText: "View All"
    },
    {
      title: "Study Sessions",
      description: "Practice with your flashcards using spaced repetition techniques",
      icon: BookOpen,
      link: "/dashboard",
      color: "shadow-purple/20",
      buttonText: "Start Studying"
    },
    {
      title: "Practice Quiz",
      description: "Test your knowledge with interactive quizzes and track your progress",
      icon: Brain,
      link: "/dashboard",
      color: "shadow-orange/20",
      buttonText: "Take Quiz"
    },
    {
      title: "Progress Dashboard",
      description: "Track your learning progress, study streaks, and performance metrics",
      icon: BarChart3,
      link: "/dashboard",
      color: "shadow-indigo/20",
      buttonText: "View Stats"
    },
    {
      title: "Achievements",
      description: "Unlock badges and achievements as you progress in your learning journey",
      icon: Trophy,
      link: "/dashboard",
      color: "shadow-yellow/20",
      buttonText: "View Achievements"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <Header showBackButton={false} showLogoutButton={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text-primary">
            Welcome to Cognita
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered learning companion. Upload PDFs, create flashcards, 
            and master any subject with intelligent study sessions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className={`hover:shadow-lg transition-all duration-300 ${feature.color}`}>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to={feature.link}>
                      {feature.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Getting Started Section */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Getting Started</CardTitle>
            <CardDescription className="text-center">
              Follow these steps to begin your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload Your PDFs</h3>
                <p className="text-sm text-muted-foreground">
                  Start by uploading your PDF documents. Our AI will automatically extract key information.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Review Flashcards</h3>
                <p className="text-sm text-muted-foreground">
                  Check the generated flashcards and make any adjustments to questions and answers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Start Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Begin studying with our intelligent system that adapts to your learning pace.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>Ready to transform your learning experience? Let's get started!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
