// src/utils/playAudio.ts

export const playDocumentAudio = async (
  documentId: string,
  audioElement: HTMLAudioElement,
) => {
  const response = await fetch(
    `/api/play?documentId=${encodeURIComponent(documentId)}`,
  );
  if (!response.ok) throw new Error("Failed to stream audio");

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  audioElement.src = audioUrl;
  audioElement.play();
};

// Attach to Play buttons (example for vanilla JS; adapt for framework if needed)
export function attachPlayHandlers(
  buttonSelector: string,
  audioSelector: string,
) {
  document
    .querySelectorAll<HTMLButtonElement>(buttonSelector)
    .forEach((button) => {
      button.addEventListener("click", () => {
        const documentId = button.dataset.documentId;
        const audioElement =
          document.querySelector<HTMLAudioElement>(audioSelector);
        if (documentId && audioElement) {
          playDocumentAudio(documentId, audioElement);
        }
      });
    });
}
