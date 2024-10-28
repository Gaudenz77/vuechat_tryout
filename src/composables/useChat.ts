import { ref } from "vue";
import { db } from "../main"; // Import the initialized db instance from main.ts
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where, // Import the where function
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

interface Message {
  id: string;
  userName: string;
  userPhotoURL?: string;
  userId: string;
  text: string;
  createdAt: any;
}

export function useChat() {
  const messages = ref<Message[]>([]);
  const messagesCollection = collection(db, "messages");

  const sendMessage = async (text: string, user: any) => {
    if (!user) return;
    const { uid, photoURL, displayName } = user;
    try {
      await addDoc(messagesCollection, {
        userName: displayName || "Anonymous",
        userPhotoURL: photoURL || "", // Handle missing photoURL gracefully
        userId: uid,
        text,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const loadMessages = () => {
    // Calculate the date for 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 10);

    // Query to load messages from the last 7 days
    const messagesQuery = query(
      messagesCollection,
      where("createdAt", ">=", oneWeekAgo), // Filter messages from the past 7 days
      orderBy("createdAt", "asc")
    );

    onSnapshot(messagesQuery, (snapshot) => {
      messages.value = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          userId: data.userId,
          text: data.text,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date() // Fallback to current date
        };
      }) as Message[];
    });
  };

  loadMessages();
  return { messages, sendMessage };
}
