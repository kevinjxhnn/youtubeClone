# YouTube Clone

Welcome to the YouTube Clone project! This project is a simplified version of YouTube, allowing users to perform various actions such as subscribing to channels, uploading videos, liking videos, and more.

## Features

### For Users Not Signed In

- **Limited Actions:** Users who are not signed in can only browse videos. They cannot subscribe, upload, like, or comment on videos.

### For Signed-In Users

- **Google Authentication:** Users can sign in using Google authentication.
- **Create a Channel:** Once signed in, users can create a channel. The channel name must be unique.
- **Upload Videos:** Users can upload videos with a unique thumbnail.
- **Like Videos:** Signed-in users can like videos they enjoy.
- **Subscribe to Channels:** Users can subscribe to channels to stay updated with their content.
- **Comment on Videos:** Users can leave comments under videos.

### Additional Pages

- **Subscription Page:** Displays all the channels a user has subscribed to.
- **Your Channel Page:** Shows all the videos the user has uploaded.
- **Separate Channel Pages:** Dedicated pages for each channel creator.

## Technologies Used

- **Firebase Storage:** Used for uploading content such as thumbnails and videos.
- **Firebase Authentication:** Handles user authentication.
- **Firebase Firestore:** Serves as the database to store user and video-related data.

## Getting Started

1. Clone the repository to your local machine.
    ```bash
    git clone https://github.com/kevinjxhnn/youtubeClone.git
    ```
2. Cd into the directory

3. Install the dependancies
    ```bash
    npm install
    ```

4. Run the project
    ```bash
    npm start
    ```
