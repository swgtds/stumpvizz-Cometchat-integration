
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import ChatComponent from "./ChatComponent";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const ChatDialog = () => {
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full px-4">
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cricket Fan Chat</DialogTitle>
          <DialogDescription>
            Enter a username to join the cricket discussion
          </DialogDescription>
        </DialogHeader>
        
        {isAuthenticated ? (
          <ChatComponent />
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
