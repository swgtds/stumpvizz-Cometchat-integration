
import { useState, useEffect, useRef } from 'react';
import { CometChat } from "@cometchat/chat-sdk-javascript"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, LogOut } from "lucide-react";
import { COMETCHAT_GROUPS } from '@/config/cometchat';

interface ChatMessage {
  id: string;
  text: string;
  sender: {
    uid: string;
    name?: string;
  };
  sentAt: number;
}

interface ChatComponentProps {
  groupId?: string; // Use custom group ID or default to global
  modern?: boolean; // New prop for modern UI
}

const ChatComponent: React.FC<ChatComponentProps> = ({ 
  groupId = COMETCHAT_GROUPS.GLOBAL_GROUP,
  modern = false
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle user logout
  const handleLogout = async () => {
    // Reset local state
    setMessages([]);
    setIsJoined(false);
    
    // Call auth context logout
    await logout();
  };

  // Join the chat group
  useEffect(() => {
    const joinGroup = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        // First check if group exists, if not, create it
        try {
  await CometChat.getGroup(groupId);
} catch (error) {
  const group = new CometChat.Group(
    groupId,
    groupId === COMETCHAT_GROUPS.GLOBAL_GROUP ? "Global Chat" : `Live Match Chat`,
    CometChat.GROUP_TYPE.PUBLIC,
    ""
  );
  await CometChat.createGroup(group);
}

// ✅ JOIN THE GROUP before sending or fetching messages
//await CometChat.joinGroup(groupId, CometChat.GROUP_TYPE.PUBLIC, "");
setIsJoined(true);

        
        // Fetch previous messages
        const limit = 50;
        const messagesRequest = new CometChat.MessagesRequestBuilder()
          .setGUID(groupId)
          .setLimit(limit)
          .build();
          
        // Safely extract data from message objects
        const previousMessages = await messagesRequest.fetchPrevious();
        const typedMessages: ChatMessage[] = previousMessages.map((msg: any) => {
          // Extract message data safely
          let messageText = "";
          
          // Handle TextMessage type
          if (msg instanceof CometChat.TextMessage && typeof msg.getText === 'function') {
            messageText = msg.getText();
          }
          
          return {
            // Extract data safely using getters and convert number to string where needed
            id: msg.getId ? msg.getId() : String(Date.now()),
            text: messageText,
            sender: {
              uid: msg.getSender ? msg.getSender().getUid() : 'unknown',
              name: msg.getSender ? msg.getSender().getName() : undefined
            },
            sentAt: msg.getSentAt ? msg.getSentAt() : Date.now()
          };
        });
        
        setMessages(typedMessages);
        
        // Add message listener
        CometChat.addMessageListener(
          groupId,
          new CometChat.MessageListener({
            onTextMessageReceived: (textMessage: any) => {
              if (textMessage && textMessage instanceof CometChat.TextMessage && typeof textMessage.getText === 'function') {
                const typedMessage: ChatMessage = {
                  // Convert number to string for id where needed
                  id: textMessage.getId ? String(textMessage.getId()) : String(Date.now()),
                  text: textMessage.getText ? textMessage.getText() : "",
                  sender: {
                    uid: textMessage.getSender ? textMessage.getSender().getUid() : 'unknown',
                    name: textMessage.getSender ? textMessage.getSender().getName() : undefined
                  },
                  sentAt: textMessage.getSentAt ? textMessage.getSentAt() : Date.now()
                };
                
                setMessages((prevMessages) => [...prevMessages, typedMessage]);
                scrollToBottom();
              }
            },
          })
        );
      } catch (error) {
        console.error("Error joining group:", error);
      }
    };
    
    joinGroup();
    
    return () => {
      // Remove message listener when component unmounts
      CometChat.removeMessageListener(groupId);
    };
  }, [groupId, isAuthenticated, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Send message function
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !isAuthenticated || !isJoined) return;
    
    try {
      const textMessage = new CometChat.TextMessage(
        groupId,
        message,
        CometChat.RECEIVER_TYPE.GROUP
      );
      
      const sentMessage = await CometChat.sendMessage(textMessage);
      
      if (sentMessage && sentMessage instanceof CometChat.TextMessage && typeof sentMessage.getText === 'function') {
        // Extract data safely using getters and convert number to string where needed
        const typedMessage: ChatMessage = {
          id: sentMessage.getId ? String(sentMessage.getId()) : String(Date.now()),
          text: sentMessage.getText ? sentMessage.getText() : "",
          sender: {
            uid: sentMessage.getSender ? sentMessage.getSender().getUid() : 'unknown',
            name: sentMessage.getSender ? sentMessage.getSender().getName() : undefined
          },
          sentAt: sentMessage.getSentAt ? sentMessage.getSentAt() : Date.now()
        };
        
        setMessages((prevMessages) => [...prevMessages, typedMessage]);
      }
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground">
            Please login to join the chat.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Modern chat UI
  if (modern) {
    return (
      <Card className="w-full rounded-xl overflow-hidden shadow-lg border-0">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-cricket-green/90 to-cricket-green text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-semibold">Live Match Chat</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {messages.length} messages
              </div>
              <div className="flex items-center gap-2 text-white cursor-pointer" onClick={handleLogout}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Logout</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 pb-0">
            <p className="text-sm text-muted-foreground mb-4 bg-muted/30 p-3 rounded-lg">
              Welcome to the group chat! Discuss the match with other fans in real-time.
            </p>
            
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender.uid === user?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.sender.uid === user?.id
                            ? "bg-cricket-green text-white rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        }`}
                      >
                        <div className="text-xs font-medium mb-1">
                          {msg.sender.uid === user?.id
                            ? "You"
                            : msg.sender.name || msg.sender.uid}
                        </div>
                        <p className="break-words text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
          
          <div className="p-4">
            <form onSubmit={sendMessage} className="flex gap-2 items-center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow rounded-full border-muted bg-background"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full bg-cricket-green hover:bg-cricket-green/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Original chat UI
  return (
    <Card className="w-full">
      <CardContent className="p-4 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Cricket Chat</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs h-8"
          >
            <LogOut className="h-3 w-3" />
            Logout
          </Button>
        </div>
        <ScrollArea className="flex-grow h-[340px] mb-4">
          <div className="space-y-4 p-2">
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground">No messages yet.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender.uid === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      msg.sender.uid === user?.id
                        ? "bg-cricket-green text-white"
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {msg.sender.uid === user?.id
                        ? "You"
                        : msg.sender.name || msg.sender.uid}
                    </div>
                    <p className="break-words">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatComponent;
