# AI Email Classifier

This project is a web application that allows users to sign in with their Google account, fetch their latest emails, classify them into categories, and display them with color-coded labels. The classifications include Important, Promotions, Social, Marketing, Spam, and General.

## Demo

https://github.com/neerajkumarc/ai-email-classifier/assets/78979288/10417e57-d74a-47a0-a175-87d73ab3c748


## Getting Started

### Prerequisites

- Node.js and npm installed.
- Firebase project setup.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/neerajkumarc/ai-email-classifier
    cd ai-email-classifier
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a Firebase project and obtain your Firebase configuration.

4. Configure Firebase in your project:

    - Create a `.env` file in the root of your project.
    - Add your Firebase configuration to `.env`:
    - Get your gemini API from [here](https://ai.google.dev/gemini-api).
      ```env
      NEXT_PUBLIC_API_KEY=your-gemini-api-key 
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
      NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
      ```

### Running the Application

1. Start the development server:

    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `src/firebaseConfig.js`: Firebase configuration and authentication functions.
- `src/app/page.js`: Main component handling user authentication, fetching emails, and displaying them.
- `lib/getEmails.js`: Utility function for fetching emails.

## Usage

- **Sign In**: Click on "Sign in with Google" to authenticate with your Google account.
- **Fetch Emails**: Once signed in, click on "Fetch Latest Emails" to fetch and classify your emails.
- **Classifications**: Emails are classified into categories and displayed with the following color codes:
  - **Important**: Green
  - **Promotions**: Blue
  - **Social**: Red
  - **Marketing**: Orange
  - **Spam**: Red
  - **General**: Blue
- **Sign Out**: Click on "Logout" to sign out of your Google account.


## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## Acknowledgements

- Thanks to Google for their Gemini AI technology.
