import React, { createContext, useContext, useState, useEffect } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { COMETCHAT_CONSTANTS, COMETCHAT_API } from "@/config/cometchat";
import { useToast } from "@/components/ui/use-toast";

// Define user type
interface User {
  id: string;
  username: string;
  email: string;
  nickname?: string;
}

interface UserProfileUpdate {
  username?: string;
  email?: string;
  nickname?: string;
}

interface NewUser {
  uid: string;
  name: string;
  email?: string;
  avatar?: string;
  metadata?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (uid: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUserProfile: (updates: UserProfileUpdate) => void;
  createUser: (userData: NewUser) => Promise<boolean>;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  isLoading: true,
  updateUserProfile: () => {},
  createUser: async () => false
});

// For demo purposes, we'll use localStorage to store user data
const STORAGE_KEY = "cometchat_user";

// initialize CometChat
const initCometChat = async () => {
  try {
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(COMETCHAT_CONSTANTS.REGION)
      .build();

    await CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting);
    console.log("CometChat initialization completed successfully");
    return true;
  } catch (error) {
    console.error("CometChat initialization failed with error:", error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize CometChat
  useEffect(() => {
    const setupCometChat = async () => {
      await initCometChat();
      try {
        const cometUser = await CometChat.getLoggedinUser();
        if (cometUser) {
          const storedUser = localStorage.getItem(STORAGE_KEY);
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.log("AuthContext - Restored user from storage:", parsedUser.username);
            } catch (e) {
              console.error("Error parsing stored user:", e);
              localStorage.removeItem(STORAGE_KEY);
              await CometChat.logout();
            }
          } else {
            const newUser = {
              id: cometUser.getUid(),
              username: cometUser.getName() || cometUser.getUid(),
              email: cometUser.getUid() + "@example.com", 
            };
            setUser(newUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
          }
        }
      } catch (error) {
        console.error("Error checking CometChat login status:", error);
      }
      
      setIsLoading(false);
    };

    setupCometChat();
  }, []);

  // Login function using CometChat 
  const login = async (uid: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const cometUser = await CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY);
      
      if (cometUser) {
        const newUser = {
          id: cometUser.getUid(),
          username: cometUser.getName() || cometUser.getUid(),
          email: `${uid}@example.com`,
          nickname: cometUser.getName() || undefined,
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
        console.log("CometChat - User logged in successfully:", newUser.username);
        return true;
      }
      
      console.log("CometChat - Login failed for:", uid);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await CometChat.logout();
      
      localStorage.removeItem(STORAGE_KEY);
      console.log("CometChat - User logged out");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUserProfile = (updates: UserProfileUpdate) => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        ...updates
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
          setUser(updatedUser);
      
      if (updates.nickname) {
    
        const cometChatUser = new CometChat.User(user.id);
        cometChatUser.setName(updates.nickname);
        CometChat.updateUser(cometChatUser, COMETCHAT_CONSTANTS.AUTH_KEY).catch(error => {
          console.error("Error updating CometChat user:", error);
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const createUser = async (userData: NewUser): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!COMETCHAT_CONSTANTS.REST_API_KEY) {
        toast({
          title: "Error",
          description: "REST API Key not configured",
          variant: "destructive"
        });
        return false;
      }

      const response = await fetch(
        COMETCHAT_API.CREATE_USER(COMETCHAT_CONSTANTS.APP_ID, COMETCHAT_CONSTANTS.REGION), 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apiKey': COMETCHAT_CONSTANTS.REST_API_KEY
          },
          body: JSON.stringify(userData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Failed to create user",
          description: errorData.message || "An error occurred",
          variant: "destructive"
        });
        return false;
      }

      const data = await response.json();
      toast({
        title: "User created successfully",
        description: `User ${data.data.name} has been created`
      });
      
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout,
        isLoading,
        updateUserProfile,
        createUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);