import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChannels } from "@/config/channels"; // Fetch men's matches dynamically
import { fetchWomenChannels } from "@/config/women-channels"; // Fetch women's matches dynamically
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { format, isAfter, isBefore, parse } from "date-fns";
import { COMETCHAT_GROUPS } from "@/config/cometchat";
import ChatComponent from "./ChatComponent";
import { useAuth } from "@/contexts/AuthContext";
import ChatLogin from "./ChatLogin";
import UserRegistrationForm from "./UserRegistrationForm";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";

// Converts "yyyy-MM-dd" to "dd MMM, yyyy"
const formatDate = (dateStr: string) => format(new Date(dateStr), "do MMM, yyyy");

// Converts "HH:mm" to "h:mm a"
const formatTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return format(new Date(0, 0, 0, hours, minutes), "h:mm a");
};

const ChannelStream = () => {
  const { channelId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<any | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);

  
  const matchChatGroupId = channelId ? `${COMETCHAT_GROUPS.LIVE_MATCH_PREFIX}${channelId}` : '';

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
  };

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const menChannels = await fetchChannels();
        const womenChannels = await fetchWomenChannels();
        const allChannels = [...menChannels, ...womenChannels];

        const foundChannel = allChannels.find((c) => c.id === channelId);
        setChannel(foundChannel);
      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [channelId]);

  useEffect(() => {
    if (!channel) return;

    const checkAvailability = () => {
      try {
        const now = new Date();
        const currentTime = format(now, "HH:mm");
        const currentDate = format(now, "yyyy-MM-dd");

        const matchDate = channel.match?.date || "";
        const startTime = channel.startTime || "";
        const endTime = channel.endTime || "";

        const parsedMatchDate = parse(matchDate, "yyyy-MM-dd", new Date());
        const parsedCurrentDate = parse(currentDate, "yyyy-MM-dd", new Date());

        const isDateValid = parsedMatchDate.getTime() === parsedCurrentDate.getTime();

        const isTimeValid =
          isAfter(parse(currentTime, "HH:mm", new Date()), parse(startTime, "HH:mm", new Date())) &&
          isBefore(parse(currentTime, "HH:mm", new Date()), parse(endTime, "HH:mm", new Date()));

        const isValid = isDateValid && isTimeValid;
        setIsAvailable(isValid);

        if (!isValid) {
          let message = "Match is not available. ";
          if (!isDateValid) {
            message += `This match is scheduled for ${formatDate(matchDate)}. `;
          }
          if (!isTimeValid) {
            message += `Live streaming is only available between ${formatTime(startTime)} and ${formatTime(endTime)}.`;
          }

          toast({
            variant: "destructive",
            title: "Match Unavailable",
            description: message,
          });
        }
      } catch (error) {
        console.error("Error checking match availability:", error);
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [channel, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Channel Not Found</h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/live-stream")}
        >
          <ArrowLeft className="mr-2" /> Back to Channels
        </Button>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/live-stream")}
        >
          <ArrowLeft className="mr-2" /> Back to Channels
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Match Currently Unavailable
          </h2>
          <p className="text-muted-foreground text-center">
            {channel.match?.team1} vs {channel.match?.team2} will be available on{" "}
            <strong>{formatDate(channel.match?.date)}</strong> <br />
            between <strong>{formatTime(channel.startTime)}</strong> and{" "}
            <strong>{formatTime(channel.endTime)}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/live-stream")}
        >
          <ArrowLeft className="mr-2" /> Back to Channels
        </Button>
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">
            {channel.match?.team1} vs {channel.match?.team2}
          </h1>
          <p className="text-muted-foreground">
            Live Match - {channel.match?.date}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoPlayer
              src={channel.streamUrl} isIframe={true}
              isLive
            />
          </div>
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Live Chat</h2>
              {!isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRegistration(true)}
                  className="flex items-center gap-1"
                >
                  <UserPlus className="h-3 w-3" />
                  <span>Register</span>
                </Button>
              )}
            </div>
            {isAuthenticated ? (
              <ChatComponent groupId={matchChatGroupId} modern={true} />
            ) : (
              <ChatLogin />
            )}
          </div>
        </div>
      </div>

      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Chat Account</DialogTitle>
            <DialogDescription>
              Register a new account to join the live match discussion
            </DialogDescription>
          </DialogHeader>
          <UserRegistrationForm 
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistration(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelStream;
