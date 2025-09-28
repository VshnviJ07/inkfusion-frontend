// src/NoteItem.js
import React, { useState } from "react";

function NoteItem({ note, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({ ...note });

  const handleSave = () => {
    onUpdate(note._id, editedNote);
    setEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-4 shadow rounded relative">
      {editing ? (
        <>
          <input className="w-full p-2 mb-2 border rounded" value={editedNote.title} onChange={e => setEditedNote({ ...editedNote, title: e.target.value })} />
          <textarea className="w-full p-2 mb-2 border rounded" rows="3" value={editedNote.description} onChange={e => setEditedNote({ ...editedNote, description: e.target.value })}></textarea>
          <input className="w-full p-2 mb-2 border rounded" value={editedNote.tag} onChange={e => setEditedNote({ ...editedNote, tag: e.target.value })} />
          <input className="w-full p-2 mb-2 border rounded" value={editedNote.image} placeholder="Image URL or Base64" onChange={e => setEditedNote({ ...editedNote, image: e.target.value })} />
          <input className="w-full p-2 mb-2 border rounded" value={editedNote.audio} placeholder="Audio URL or Base64" onChange={e => setEditedNote({ ...editedNote, audio: e.target.value })} />
          <div className="flex space-x-2">
            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={handleSave}>Save</button>
            <button className="bg-gray-500 text-white px-2 py-1 rounded" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h4 className="font-bold text-lg text-black dark:text-white">{note.title}</h4>
          <p className="text-black dark:text-gray-200">{note.description}</p>
          <small className="text-gray-500 dark:text-gray-400">{note.tag}</small>
          {note.image && <img src={note.image} alt="note" className="mt-2 rounded max-h-48 w-full object-cover" />}
          {note.audio && <audio controls src={note.audio} className="mt-2 w-full" />}
          <div className="flex space-x-2 mt-2">
            <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => setEditing(true)}>Edit</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(note._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteItem;
