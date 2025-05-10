# 🏏 StumpVizz CometChat Integration

This is a simplified version of my project [StumpVizz](https://github.com/swgtds/stumpvizz), built to demonstrate **CometChat UI Kit integration** in a real-world context.
I have also deployed the project
<h2>YOU CAN ACCESS THE WEBSITE FROM THIS LINK TO CHECK IT(<a href="https://stumpvizz-cometchat-integration.vercel.app/">CLICK HERE</a>)</h2>

## What is this?

This project is part of the **CometChat Internship Assignment**. The goal is to integrate the CometChat UI Kit into a basic application and showcase how it works in a functional use case.

I have used a **cricket-themed live streaming concept** where fans can:
- Login with a UID and **Live Chat** with other viewers
- Choose a live cricket match and Live Chat with viewers
- Join a dedicated group chat for that match and also there is a **global** chat.

---

## Features

- CometChat **UI Kit** fully integrated
- **Match-based group chats** 
- Simple **login screen** (UID-based)
- **Live match Chat UI** with clickable chats

---

## Tech Stack

- Vite+React (TypeScript)
- CometChat JavaScript SDK
- CometChat React UI Kit

## Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/swgtds/stumpvizz-Cometchat-integration.git
cd stumpvizz-Cometchat-integration
npm install
```
### 2. Set Up CometChat

Sign up at [CometChat](https://app.cometchat.com).
Create an app by following the steps and get :
- App ID
- Region
- Auth Key
from the Home/Overview page!

### 3. Create an Environment Variable(.env) in the Root Directory to store your credentials
```bash
VITE_BACKEND_URL= <Your backend URL>
VITE_COMETCHAT_APP_ID=<Your App ID> 
VITE_COMETCHAT_REGION=<Your App Region>
VITE_COMETCHAT_AUTH_KEY= <Your Auth Key>
```

### 4.Run the app
```bash
npm run dev
```
DM me on [Linkedin](https://www.linkedin.com/in/swgtds/) or [Email me](mailto:swagatadas003@gmail.com) if you run into any issues