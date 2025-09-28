import React from "react";

function About() {
  return (
    <div className="flex justify-center items-start pt-20 bg-gray-100 min-h-screen p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl text-center">
        <h2 className="text-2xl font-bold mb-4">About InkFusion</h2>
        <p className="text-gray-700">
          InkFusion is a powerful full-stack MERN notes application designed to help users securely create, manage, and organize their notes in real-time. With features like user authentication, seamless note creation, editing, and deletion, InkFusion offers a smooth and modern interface that works flawlessly across devices. Its intuitive design ensures productivity while keeping your data safe and accessible anytime, anywhere.
        </p>
      </div>
    </div>
  );
}

export default About;
