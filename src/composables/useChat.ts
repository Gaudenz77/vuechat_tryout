import { ref } from "vue";
import { db } from "../main"; // Import the initialized db instance from main.ts
import {
  collection,
  addDoc,
  onSnapshot,
  query,
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
  // Function to send a message with displayName from Firestore
  const sendMessage = async (text: string, user: any) => {
    if (!user) return;
    const { uid, photoURL, displayName } = user;
    try {
      await addDoc(messagesCollection, {
        userName: displayName || 'Anonymous',
        userPhotoURL: photoURL || '', // Handle undefined photo URLs
        userId: uid,
        text: text,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const loadMessages = () => {
    const messagesQuery = query(
      messagesCollection,
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
