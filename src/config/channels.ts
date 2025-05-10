/*export interface Channel {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  streamUrl: string;
  match?: {
    team1: string;
    team2: string;
    date: string;
    thumbnail: string;
  };
};
export const fetchChannels = async (): Promise<Channel[]> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("Backend URL is not defined in environment variables.");
    }
    const response = await fetch(`${backendUrl}/api/men-matches`);
    if (!response.ok) {
      throw new Error("Failed to fetch men's matches");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
*/
export interface Channel {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  streamUrl: string;
  match?: {
    team1: string;
    team2: string;
    date: string;
    thumbnail: string;
  };
};

export const fetchChannels = async (): Promise<Channel[]> => {
  const streamLink = "https://www.youtube.com/embed/Q14J-bnjtMQ"; 

  return [
    {
      id: "a1-vs-b1",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-11",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a2-vs-b2",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-12",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a3-vs-b3",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-13",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a4-vs-b4",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-14",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a5-vs-b5",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-15",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a6-vs-b6",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-16",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a7-vs-b7",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-17",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a8-vs-b8",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-18",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a9-vs-b9",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-19",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
    {
      id: "a6-vs-b6",
      name: "Live Match 1",
      startTime: "00:00",               
      endTime: "23:59",                 
      streamUrl: streamLink,
      match: {
        team1: "Team A",
        team2: "Team B",
        date: "2025-05-20",             
        thumbnail: "https://images.sidearmdev.com/fit?url=https%3a%2f%2fdxbhsrqyrr690.cloudfront.net%2fsidearm.nextgen.sites%2fuoit.sidearmsports.com%2fimages%2f2020%2f6%2f5%2f69576197_1378820782272472_6963252643883909120_o_15.jpg&height=444&width=591&type=webp",
      },
    },
  ];
};
