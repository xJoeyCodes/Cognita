import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  showUploadButton?: boolean;
  showLogoutButton?: boolean;
  className?: string;
}

export function Header({ 
  showBackButton = true, 
  backButtonText = "Back",
  showUploadButton = true,
  showLogoutButton = false,
  className = ""
}: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error) {
        setUser(user);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBackClick = async () => {
    if (user) {
      
      navigate('/home');
    } else {
      
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className={`border-b border-border/50 bg-white backdrop-blur-sm ${className}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backButtonText}
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <img 
              src="/assets/logo.png" 
              alt="Cognita Logo" 
              className="h-12 w-10 object-contain" 
            />
            <h1 className="text-xl font-bold gradient-text-primary">Cognita</h1>
          </div>
        </div>
        
        <nav className="flex items-center space-x-4">
          {showUploadButton && user && (
            <Button asChild>
              <Link to="/upload">
                <Plus className="h-4 w-4 mr-2" />
                Upload PDFs
              </Link>
            </Button>
          )}
          
          {showLogoutButton && user && (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
