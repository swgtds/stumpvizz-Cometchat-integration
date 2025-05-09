
import { useState } from 'react';
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { COMETCHAT_CONSTANTS } from "@/config/cometchat";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ChatLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const success = await login(username);
      
      if (success) {
        toast({
          title: "Welcome!",
          description: "You've successfully joined the chat"
        });
      } else {
        toast({
          title: "Login failed",
          description: "Unable to log in. Please try again or check the console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Join the Live Chat</h3>
        <p className="text-sm text-muted-foreground">
          Enter a username to join the conversation
        </p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
            disabled={isLoggingIn}
          />
        </div>
        
        <div className="space-y-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Joining..." : "Join Chat"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground px-4">
            By joining, you'll be able to chat with other cricket fans in real-time
          </p>
          
          <p className="text-xs text-center text-amber-500">
            Important: Make sure to add your CometChat APP_ID, REGION, and AUTH_KEY in the config file
          </p>
        </div>
      </form>
    </Card>
  );
};

export default ChatLogin;
