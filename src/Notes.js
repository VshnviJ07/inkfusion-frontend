// frontend/src/Notes.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function makeClientNoteFromServer(noteFromServer) {
  // server returns multimedia: [ {url, filename, ...}, ... ]
  return {
    _id: noteFromServer._id,
    title: noteFromServer.title || "",
    description: noteFromServer.description || "",
    tag: noteFromServer.tag || "General",
    savedMedia: noteFromServer.multimedia || [], // array of objects with .url
    newFiles: [], // File objects to upload
    previewUrls: [], // objectURL strings for newFiles
    dirty: false,
  };
}

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("token");
  const saveTimerRef = useRef(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notes/fetchallnotes`, {
        headers: { "auth-token": token },
      });
      const clientNotes = (res.data || []).map(makeClientNoteFromServer);
      setNotes(clientNotes);
    } catch (err) {
      console.error("fetchNotes error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // create a new empty note draft
  const addNewNote = () => {
    const newNote = {
      _id: null,
      title: "",
      description: "",
      tag: "General",
      savedMedia: [],
      newFiles: [],
      previewUrls: [],
      dirty: true,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  // handle simple field change
  const handleChange = (index, field, value) => {
    setNotes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value, dirty: true };
      return copy;
    });
  };

  // handle selected files
  const handleFiles = (index, fileList) => {
    const files = Array.from(fileList);
    setNotes((prev) => {
      const copy = [...prev];
      const note = { ...copy[index] };
      note.newFiles = [...note.newFiles, ...files];
      const urls = files.map((f) => URL.createObjectURL(f));
      note.previewUrls = [...note.previewUrls, ...urls];
      note.dirty = true;
      copy[index] = note;
      return copy;
    });
  };

  // handle paste on textarea (images)
  const handlePaste = (index, e) => {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    const images = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") === 0) {
        const blob = item.getAsFile();
        if (blob) {
          // convert blob to File to keep name and type
          const file = new File([blob], `pasted-${Date.now()}.png`, { type: blob.type });
          images.push(file);
        }
      }
    }
    if (images.length > 0) {
      // append them like normal files
      setNotes((prev) => {
        const copy = [...prev];
        const note = { ...copy[index] };
        note.newFiles = [...note.newFiles, ...images];
        note.previewUrls = [...note.previewUrls, ...images.map((f) => URL.createObjectURL(f))];
        note.dirty = true;
        copy[index] = note;
        return copy;
      });
    }
  };

  // remove media (both saved and preview)
  const removeMedia = (noteIndex, mediaIndex, isSaved) => {
    setNotes((prev) => {
      const copy = [...prev];
      const note = { ...copy[noteIndex] };
      if (isSaved) {
        // remove from savedMedia by index
        note.savedMedia = note.savedMedia.filter((_, i) => i !== mediaIndex);
      } else {
        // remove from previews and newFiles
        if (note.previewUrls && note.previewUrls[mediaIndex]) {
          URL.revokeObjectURL(note.previewUrls[mediaIndex]);
        }
        note.previewUrls = note.previewUrls.filter((_, i) => i !== mediaIndex);
        note.newFiles = note.newFiles.filter((_, i) => i !== mediaIndex);
      }
      note.dirty = true;
      copy[noteIndex] = note;
      return copy;
    });
  };

  // delete entire note
  const deleteNote = async (note, index) => {
    try {
      if (note._id) {
        await axios.delete(`${API_BASE}/api/notes/deletenote/${note._id}`, { headers: { "auth-token": token } });
      }
      setNotes((prev) => {
        const c = [...prev];
        c.splice(index, 1);
        return c;
      });
    } catch (err) {
      console.error("delete note error:", err);
    }
  };

  // Auto-save (debounced)
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    // if no notes changed, skip
    saveTimerRef.current = setTimeout(() => {
      notes.forEach(async (note, idx) => {
        if (!note.dirty) return;
        // skip saving totally empty note
        const isEmpty = !note.title && !note.description && (!note.savedMedia || note.savedMedia.length === 0) && (!note.newFiles || note.newFiles.length === 0);
        if (isEmpty && !note._id) {
          // do not create empty draft
          return;
        }

        try {
          const formData = new FormData();
          formData.append("title", note.title || "");
          formData.append("description", note.description || "");
          formData.append("tag", note.tag || "General");

          // Add new files
          if (note.newFiles && note.newFiles.length > 0) {
            note.newFiles.forEach((f) => formData.append("files", f));
          }

          // Send existing saved server media URLs
          const existingUrls = (note.savedMedia || []).map((m) => (m && m.url) ? m.url : (m || "")).filter(Boolean);
          formData.append("existingMultimedia", JSON.stringify(existingUrls));

          if (note._id) {
            // update
            const res = await axios.put(`${API_BASE}/api/notes/updatenote/${note._id}`, formData, {
              headers: { "auth-token": token },
            });
            // replace local note with server response (reset file buffers)
            const replaced = makeClientNoteFromServer(res.data);
            setNotes((prev) => {
              const copy = [...prev];
              copy[idx] = replaced;
              return copy;
            });
          } else {
            // create new
            const res = await axios.post(`${API_BASE}/api/notes/addnote`, formData, {
              headers: { "auth-token": token },
            });
            const replaced = makeClientNoteFromServer(res.data);
            setNotes((prev) => {
              const copy = [...prev];
              copy[idx] = replaced;
              return copy;
            });
          }
        } catch (err) {
          console.error("auto-save error:", err);
        }
      });
    }, 800); // 800ms debounce
    return () => clearTimeout(saveTimerRef.current);
  }, [notes, token]);

  // helper to compute display list: savedMedia urls first then previews
  const getDisplayMedia = (note) => {
    const saved = (note.savedMedia || []).map((m) => ({ url: m.url, isSaved: true }));
    const previews = (note.previewUrls || []).map((u) => ({ url: u, isSaved: false }));
    return [...saved, ...previews];
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
      <div className="mb-4">
        <button onClick={addNewNote} className="mb-2 p-2 bg-blue-500 text-white rounded">Add Note</button>
      </div>

      {notes.map((note, index) => (
        <div key={note._id || index} className="border p-3 mb-4 rounded bg-gray-100">
          <div className="flex justify-between items-start">
            <input
              type="text"
              value={note.title}
              placeholder="Title"
              className="border p-2 w-3/4 mb-2"
              onChange={(e) => handleChange(index, "title", e.target.value)}
            />
            <button className="text-red-500 ml-2" onClick={() => deleteNote(note, index)}>Delete</button>
          </div>

          <textarea
            value={note.description}
            placeholder="Description"
            className="border p-2 w-full mb-2"
            rows="4"
            onChange={(e) => handleChange(index, "description", e.target.value)}
            onPaste={(e) => handlePaste(index, e)}
          />

          <div className="mb-2">
            <input type="file" multiple onChange={(e) => handleFiles(index, e.target.files)} />
          </div>

          <div className="flex flex-wrap gap-2">
            {getDisplayMedia(note).map((m, idx) => (
              <div key={idx} className="relative">
                {m.url.match(/\.(mp4|webm)$/i) ? (
                  <video src={m.url} controls className="w-32 h-20 object-cover" />
                ) : m.url.match(/\.(mp3|wav)$/i) ? (
                  <audio src={m.url} controls />
                ) : (
                  <img src={m.url} alt="media" className="w-32 h-20 object-cover" />
                )}
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  onClick={() => removeMedia(index, idx, m.isSaved)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes;
