import { createContext, useContext, useState, useEffect } from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript"
import { COMETCHAT_CONSTANTS } from "@/config/cometchat"

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (uid: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUserProfile: (updates: UserProfileUpdate) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  isLoading: true,
  updateUserProfile: () => {},
});

// For demo purposes, use localStorage to store user data
const STORAGE_KEY = "cometchat_user";

// Initialize CometChat
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

// initialize cometchat
  useEffect(() => {
    const setupCometChat = async () => {
      await initCometChat();
      
      // to check if user is logged in to CometChat
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
              // logout from CometChat as well
              await CometChat.logout();
            }
          } else {
            // create a user object from CometChat user
            const newUser = {
              id: cometUser.getUid(),
              username: cometUser.getName() || cometUser.getUid(),
              email: cometUser.getUid() + "@example.com", // CometChat doesn't store emails by default
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
  const login = async (uid: 'cometchat-uid-1'): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Login with CometChat
      const cometUser = await CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY);
      
      if (cometUser) {
        // Create user object
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
      // Logout from CometChat
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

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout,
        isLoading,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
