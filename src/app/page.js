"use client";
import { useState } from "react";
import { signInWithGoogle, signOut } from "./firebaseConfig";
import { getEmails } from "../../lib/getEmails";
import Image from "next/image";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Home() {
  const [user, setUser] = useState(null);
  const [emailData, setEmailData] = useState([]);
  const [status, setStatus] = useState("Fetch Latest Emails");
  const [classifications, setClassifications] = useState({});
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const disableButton = () => {
    setButtonDisabled(true);
  };

  const enableButton = () => {
    setButtonDisabled(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setEmailData([])
    } catch (error) {
      console.error(error);
    }
  };

  async function handleGetEmails(count) {
    setEmailData([])
    disableButton()
    setStatus("Fetching emails please wait....");
    setEmailData(await getEmails(user.token, count));
    setStatus("Fetch Latest Email");
    enableButton()
  }

  async function handleClassify() {
    disableButton()
    setStatus("Classifying please wait...")
    let data = "";
    emailData.map((email) => (data += `"id": ${email.msgDetails.id}, "content": ${email.msgDetails.snippet},\n`));
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `You are an email classifier, classify the emails from the following array ${data} into the following categories (Important, Promotions, Social, Marketing, Spam, General) Follow this Important: Emails that are personal or work-related and require immediate attention.
Promotions: Emails related to sales, discounts, and marketing campaigns.
Social: Emails from social networks, friends, and family.
Marketing: Emails related to marketing, newsletters, and notifications.
Spam: Unwanted or unsolicited emails.
General: If none of the above are matched, use General
. Output the response in the following format [{emailId, category}] only do not give other things like text, etc....`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const jsonString = text.replace(/^```json\s*|```\s*$/g, '');
    const classifications = JSON.parse(jsonString);
    const classificationMap = {};
    classifications.forEach(({ emailId, category }) => {
      classificationMap[emailId] = category;
    });
    setClassifications(classificationMap);
    setStatus("Fetch Latest Email")
    enableButton()
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-4xl m-2 my-4">AI Email Classifier</h1>
      <div className="flex m-12 justify-between">
        {!user ? (<div className="flex flex-col gap-4">
          <p>Please login using your gmail account, to start using AI email classifier</p>
          <button onClick={handleGoogleSignIn} className="border-2 p-2 rounded-md">Sign in with Google</button>
        </div>
        ) : (
          <div className="flex justify-between w-[20rem] md:w-[36rem]">
            <div className="flex gap-2">
              <div>
                <Image
                  className="rounded-full"
                  src={user.user.photoURL}
                  width={40}
                  height={40}
                  alt="photoUrl"
                />
              </div>
              <div>
                <p>{user.user.displayName}</p>
                <h2>{user.user.email}</h2>
              </div>
            </div>
            <div>
              <button className="border-2 p-2 rounded-md" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
      {user && (
        <>
          <button
            className={`bg-zinc-700 p-2 rounded-md border-2 mb-4 ${isButtonDisabled ? "opacity-50" : "opacity-100"}`}
            disabled={isButtonDisabled}
            onClick={() => handleGetEmails(10)}
          >
            {status}
          </button>

          <div className="flex justify-between w-[20rem] md:w-[36rem] ">
            <div className="flex">
              <label htmlFor="emailNum" className="text-white py-2">
                🔽
              </label>
              <select id="emailNum" className="w-20 bg-transparent" onChange={(e) => {
                handleGetEmails(e.target.value)
              }}>
                <option className="bg-black text-white" value={10} defaultValue={10}>
                  10
                </option>
                <option className="bg-black text-white" value={20}>
                  20
                </option>
                <option className="bg-black text-white" value={30}>
                  30
                </option>
                <option className="bg-black text-white" value={40}>
                  40
                </option>
              </select>
            </div>
            <div>
              <button className={`border-2 p-2 rounded-md ${emailData.length == 0 ? "opacity-30" : "opacity-100"}`} onClick={handleClassify}
                disabled={emailData.length == 0}
              >Classify</button>
            </div>
          </div>
        </>
      )}



      {emailData.map((email) => (
        <Sheet>
          <SheetTrigger asChild>
            <div key={email.id} className="p-2 border-2 border-white  w-[20rem] sm:w-[25rem] md:w-[36rem] m-2 cursor-pointer">
              <div className="flex justify-between"><p className="max-w-[80%]">
                {email.msgDetails.payload.headers.map((data) => {
                  if (data.name == "From") {
                    return "From: " + data.value;
                  }
                  return null;
                })}
              </p>
                <p className={
                  classifications[email.msgDetails.id] == "Important" || classifications[email.msgDetails.id] == "Security"
                    ? "text-green-500"
                    : classifications[email.msgDetails.id] == "Marketing"
                      ? "text-orange-500"
                      : classifications[email.msgDetails.id] == "General"
                        ? "text-blue-500"
                        : "text-red-500"
                }> {classifications[email.msgDetails.id]}
                </p>
              </div>
              <p className="text-zinc-500">
                {email.msgDetails.payload.headers.map((data) => {
                  if (data.name == "Date") {
                    return "Date: " + data.value;
                  }
                  return null;
                })}
              </p>
              <p className="font-bold text-lg mt-2 mb-2">
                {email.msgDetails.payload.headers.map((data) => {
                  if (data.name == "Subject") {
                    return "Subject: " + data.value;
                  }
                  return null;
                })}
              </p>
              <p className="text-sm">{email.msgDetails.snippet}</p>
            </div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle><div className="">
              <p className={
                  classifications[email.msgDetails.id] == "Important" || classifications[email.msgDetails.id] == "Security"
                    ? "text-green-500"
                    : classifications[email.msgDetails.id] == "Marketing"
                      ? "text-orange-500"
                      : classifications[email.msgDetails.id] == "General"
                        ? "text-blue-500"
                        : "text-red-500"
                }> {classifications[email.msgDetails.id]}
                </p>
                <p className="text-sm">
                  {email.msgDetails.payload.headers.map((data) => {
                    if (data.name == "From") {
                      return "From: " + data.value;
                    }
                    return null;
                  })}
                </p>
                <p className="font-bold text-lg">
                  {email.msgDetails.payload.headers.map((data) => {
                    if (data.name == "Subject") {
                      return "Subject: " + data.value;
                    }
                    return null;
                  })}
                </p>
              </div></SheetTitle>
              <SheetDescription>
                {/* all emails from the thread but it is not rendered properly, TODO: fix this. */}
                {/* {email.msgDetails.payload.parts.map((email)=>{
                  let data = email.body.data || "test"
                 return( Buffer.from(data, 'base64').toString('utf-8'))
})} */}

                {
                  Buffer.from(email.msgDetails.payload.parts[0].body.data || "test", 'base64').toString('utf-8')

                }
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">

              </div>
              <div className="grid grid-cols-4 items-center gap-4">

              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

      ))}
    </div>
  );
}
