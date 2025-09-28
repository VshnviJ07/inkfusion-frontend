// src/AddUpdateNote.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const AddUpdateNote = () => {
  const [notes, setNotes] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch notes from backend
  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes/fetchallnotes", {
        headers: { "auth-token": token },
      });
      setNotes(res.data.map(n => ({ ...n, newFiles: [] })));
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // Add new empty note
  const addNewNote = () => {
    const newNote = { _id: null, title: "", description: "", tag: "General", multimedia: [], newFiles: [] };
    setNotes([newNote, ...notes]);
  };

  // Delete note
  const deleteNote = async (note, index) => {
    if (note._id) {
      await axios.delete(`http://localhost:5000/api/notes/deletenote/${note._id}`, {
        headers: { "auth-token": token }
      });
    }
    const updated = [...notes];
    updated.splice(index, 1);
    setNotes(updated);
  };

  // Update fields (title, tag)
  const handleChange = (index, field, value) => {
    const updated = [...notes];
    updated[index][field] = value;
    setNotes(updated);
  };

  // Handle file uploads
  const handleFiles = (index, files) => {
    const updated = [...notes];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      updated[index].newFiles.push(file);
      updated[index].multimedia.push({ url });
    });
    setNotes(updated);
  };

  // Handle copy-paste of images
  const handlePaste = (index, e) => {
    e.preventDefault();
    const updated = [...notes];
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          updated[index].newFiles.push(file);
          updated[index].multimedia.push({ url });

          // Insert image in contentEditable div
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const img = document.createElement("img");
            img.src = url;
            img.className = "w-32 h-20 object-cover mb-2";
            range.deleteContents();
            range.insertNode(img);
            range.collapse(false);
          }
        }
      }
    }
    setNotes(updated);
  };

  // Remove multimedia
  const removeMedia = (noteIndex, fileIndex) => {
    const updated = [...notes];
    updated[noteIndex].multimedia.splice(fileIndex, 1);
    if (updated[noteIndex].newFiles && fileIndex < updated[noteIndex].newFiles.length)
      updated[noteIndex].newFiles.splice(fileIndex, 1);
    setNotes(updated);
  };

  // Auto-save notes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      notes.forEach(async (note, index) => {
        if (!note.title && !note.description && note.multimedia.length === 0) return;

        const formData = new FormData();
        formData.append("title", note.title || "");
        formData.append("description", note.description || "");
        formData.append("tag", note.tag || "");

        if (note.newFiles && note.newFiles.length > 0)
          note.newFiles.forEach(f => formData.append("files", f));

        // Include existing multimedia URLs for backend
        const existingUrls = note._id
          ? note.multimedia.filter(u => !note.newFiles.some(f => URL.createObjectURL(f) === u.url))
          : [];
        formData.append("existingMultimedia", JSON.stringify(existingUrls.map(m => m.url)));

        try {
          if (note._id) {
            const res = await axios.put(
              `http://localhost:5000/api/notes/updatenote/${note._id}`,
              formData,
              { headers: { "auth-token": token, "Content-Type": "multipart/form-data" } }
            );
            const updated = [...notes];
            updated[index] = { ...res.data, newFiles: [] };
            setNotes(updated);
          } else {
            const res = await axios.post(
              `http://localhost:5000/api/notes/addnote`,
              formData,
              { headers: { "auth-token": token, "Content-Type": "multipart/form-data" } }
            );
            const updated = [...notes];
            updated[index] = { ...res.data, newFiles: [] };
            setNotes(updated);
          }
        } catch (err) {
          console.error(err);
        }
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes, token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
      <button onClick={addNewNote} className="mb-4 p-2 bg-blue-500 text-white rounded">Add Note</button>

      {notes.map((note, index) => (
        <div key={index} className="border p-3 mb-2 rounded bg-gray-100">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={note.title}
              placeholder="Title"
              className="border p-1 w-3/4 mb-1"
              onChange={e => handleChange(index, "title", e.target.value)}
            />
            <button className="text-red-500" onClick={() => deleteNote(note, index)}>Delete</button>
          </div>

          {/* ContentEditable for description */}
          <div
            className="border p-1 w-full mb-2 min-h-[60px] rounded bg-white"
            contentEditable
            suppressContentEditableWarning={true}
            onInput={e => handleChange(index, "description", e.currentTarget.innerHTML)}
            onPaste={e => handlePaste(index, e)}
            dangerouslySetInnerHTML={{ __html: note.description }}
          ></div>

          <input type="file" multiple onChange={e => handleFiles(index, e.target.files)} className="mb-2" />

          <div className="flex flex-wrap gap-2">
            {note.multimedia.map((file, idx) => (
              <div key={idx} className="relative">
                {file.url.endsWith(".mp4") || file.url.endsWith(".webm") ? (
                  <video src={file.url} controls className="w-32 h-20" />
                ) : file.url.endsWith(".mp3") ? (
                  <audio src={file.url} controls />
                ) : (
                  <img src={file.url} alt="media" className="w-32 h-20 object-cover" />
                )}
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  onClick={() => removeMedia(index, idx)}
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

export default AddUpdateNote;
