import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./axiosInstance.js";

// fetchNotes
export const fetchNotes = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await api.get("/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };
  
  // createNote
  export const createNote = async ({ title, content }) => {
    const token = await AsyncStorage.getItem("token");
    const user = JSON.parse(await AsyncStorage.getItem("user"));
  
    const res = await api.post(
      "/notes",
      {
        user_id: user.id,
        title,
        content,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  };

  // deleteNote
  export const deleteNote = async (noteId) => {
    const token = await AsyncStorage.getItem("token");
    const res = await api.delete(`/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };
 
  
