"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export function InputField() {
  const placeholders = [
    "Ask me to create a task, I will get it done.",
    "Curious which product drove the most revenue?",
    "Need today report in one line? Just ask…",
    "Looking for patterns? I will surface them.",
    "Want predictions on next month growth?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-[70rem] flex flex-col mt-10">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
