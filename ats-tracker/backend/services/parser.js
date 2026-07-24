import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const parseResume = async (file) => {
  try {
    const extension = file.originalname.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') {
      const data = await pdfParse(file.buffer);
      return data.text;
    } else if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    throw new Error('Failed to parse resume: ' + error.message);
  }
};
