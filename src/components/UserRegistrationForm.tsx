
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserRegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onSuccess, onCancel }) => {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { createUser } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uid.trim() || !name.trim()) return;
    
    setIsRegistering(true);
    
    try {
      const userData = {
        uid,
        name,
        ...(email && { email }),
        ...(avatar && { avatar })
      };
      
      const success = await createUser(userData);
      
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Chat User</CardTitle>
        <CardDescription>Register a new user for the chat system</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="uid">User ID</Label>
            <Input
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Unique identifier (required)"
              required
              disabled={isRegistering}
            />
            <p className="text-xs text-muted-foreground">
              This will be used for login and must be unique
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name (required)"
              required
              disabled={isRegistering}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              disabled={isRegistering}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Avatar URL (optional)"
              disabled={isRegistering}
            />
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isRegistering}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          onClick={handleSubmit}
          disabled={isRegistering || !uid.trim() || !name.trim()}
        >
          {isRegistering ? "Creating..." : "Create User"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserRegistrationForm;