export interface Lecture {
  id: string;
  title: string;
  date: number; // timestamp
  audioUri: string;
  duration: number; // in seconds
  transcription?: string;
  summary?: string;
  flashcards?: Flashcard[];
  notes?: string;
  status: "recorded" | "processing" | "processed" | "failed";
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface ProcessingResponse {
  summary: string;
  flashcards: Flashcard[];
  notes: string;
}
