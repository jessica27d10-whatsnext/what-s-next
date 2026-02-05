/**
 * Extracts all text content from a PDF file.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    if (typeof window === "undefined") return "";

    try {
        // Dynamically import to avoid SSR issues with DOMMatrix/Canvas
        const pdfjs = await import("pdfjs-dist");

        // Use the local worker copied to public
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");
            fullText += pageText + "\n";
        }

        return fullText.trim();
    } catch (error: any) {
        console.error("PDF Extraction Error:", error);
        throw new Error("Failed to extract text from PDF. Please ensure it's a valid, non-encrypted file.");
    }
}
