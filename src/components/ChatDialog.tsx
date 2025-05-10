import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, LogOut, UserPlus } from "lucide-react";
import ChatComponent from "./ChatComponent";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import UserRegistrationForm from "./UserRegistrationForm";

export const ChatDialog = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleChatLogin = async () => {
    if (!username.trim()) return;
    setIsLoggingIn(true);
    
    try {
      await login(username);
    } catch (error) {
      console.error("Chat login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Chat logout error:", error);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full px-4">
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Cricket Fan Chat</DialogTitle>
            {!isAuthenticated && (
              <DialogDescription>
                {showRegistration 
                  ? "Create a new chat account" 
                  : "Enter a username to join the cricket discussion"}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        
        {isAuthenticated ? (
          <ChatComponent />
        ) : showRegistration ? (
          <UserRegistrationForm 
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistration(false)}
          />
        ) : (
          <div className="py-6 text-center">
            <p className="mb-4">Enter your CometChat username to join</p>
            <div className="flex gap-2 mb-4">
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <Button onClick={handleChatLogin} disabled={isLoggingIn || !username.trim()}>
                {isLoggingIn ? "Joining..." : "Join Chat"}
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Don't have an account?</p>
              <Button 
                variant="outline" 
                onClick={() => setShowRegistration(true)}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create New User
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;