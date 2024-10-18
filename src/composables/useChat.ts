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
    // Fetch the user's displayName from Firestore
    /* const userDoc = await getDoc(doc(db, 'users', uid));
      const displayName = userDoc.exists() ? userDoc.data().displayName : 'Anonymous'; */

    await addDoc(messagesCollection, {
      userName: displayName,
      userPhotoURL: photoURL,
      userId: uid,
      text: text,
      createdAt: serverTimestamp(),
    });
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
          createdAt: data.createdAt ? data.createdAt.toDate() : null, // Convert Firestore timestamp to Date
        };
      }) as Message[];
    });
  };
  loadMessages();
  return { messages, sendMessage };
}
