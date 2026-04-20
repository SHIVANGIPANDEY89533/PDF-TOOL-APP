import fitz  # PyMuPDF
import io
import zipfile
import pikepdf

from PIL import Image
from openpyxl import load_workbook
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors

def add_text_to_pdf_file(
    pdf_bytes: bytes,
    text: str,
    font_size: int,
    x_pos: int,
    y_pos: int
) -> bytes:
    """Adds text to a PDF and returns the new PDF as bytes."""
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in pdf_doc:
            page.insert_text(
                (x_pos, y_pos),
                text,
                fontsize=font_size,
                rotate=0,
                color=(0.5, 0.5, 0.5)
            )
        output_buffer = pdf_doc.tobytes()
        pdf_doc.close()
        return output_buffer
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return None


def split_pdf(file_path: str, ranges: str):
    pass

def merge_pdfs(file_paths: list):
    pass

def lock_pdf(file_path: str, password: str):
    pass

def unlock_pdf(file_path: str, password: str):
    pass



def convert_pdf_to_images(pdf_bytes: bytes) -> dict:
    """Converts a PDF into a dictionary of PNG images."""
    images = {}
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page_num in range(len(pdf_doc)):
            page = pdf_doc.load_page(page_num)
            # Render page to an image (pixmap)
            pix = page.get_pixmap()
            # Get the image data as PNG bytes
            image_data = pix.tobytes("png")
            images[f"page_{page_num + 1}.png"] = image_data
        pdf_doc.close()
    except Exception as e:
        print(f"Error converting PDF to image: {e}")
    return images



def convert_images_to_pdf(image_bytes_list: list[bytes]) -> bytes:
    """Converts a list of images into a single PDF."""
    try:
        # Open the first image
        first_image = Image.open(io.BytesIO(image_bytes_list[0])).convert("RGB")
        
        # Open the rest of the images
        other_images = []
        if len(image_bytes_list) > 1:
            for image_bytes in image_bytes_list[1:]:
                img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                other_images.append(img)
        
        # Save all images into a PDF buffer
        pdf_buffer = io.BytesIO()
        first_image.save(
            pdf_buffer, 
            "PDF", 
            save_all=True, 
            append_images=other_images
        )
        
        return pdf_buffer.getvalue()
    except Exception as e:
        print(f"Error converting images to PDF: {e}")
        return None


def compress_pdf(pdf_bytes: bytes) -> bytes:
    """Compresses a PDF by optimizing streams and reducing file size."""
    try:
        # First attempt using pikepdf for stream optimization
        out = io.BytesIO()
        with pikepdf.open(io.BytesIO(pdf_bytes)) as pdf:
            pdf.save(out, optimize_streams=True, compress_streams=True)
        return out.getvalue()
    except Exception as e:
        print(f"pikepdf compression failed: {e}")
        try:
            pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            output_buffer = pdf_doc.tobytes(deflate=True, garbage=4, clean=True)
            pdf_doc.close()
            return output_buffer
        except Exception as e2:
            print(f"fitz fallback compression failed: {e2}")
            return None


def rotate_pdf(pdf_bytes: bytes, rotation: int, pages: str = "all") -> bytes:
    """Rotates specified pages in a PDF."""
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if pages == "all":
            page_indices = range(len(pdf_doc))
        else:
            page_indices = [int(p.strip()) - 1 for p in pages.split(",")]
        
        for page_num in page_indices:
            if 0 <= page_num < len(pdf_doc):
                page = pdf_doc.load_page(page_num)
                page.set_rotation(rotation)
        
        output_buffer = pdf_doc.tobytes()
        pdf_doc.close()
        return output_buffer
    except Exception as e:
        print(f"Error rotating PDF: {e}")
        return None


def add_page_numbers(pdf_bytes: bytes, position: str, start_number: int, font_size: int, color: str) -> bytes:
    """Adds page numbers to a PDF."""
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        color_rgb = tuple(int(color[i:i+2], 16)/255 for i in (1, 3, 5))  # Convert hex to RGB
        
        for page_num, page in enumerate(pdf_doc):
            page_width = page.rect.width
            page_height = page.rect.height
            number = start_number + page_num
            
            if position == "top-left":
                x, y = 50, 50
            elif position == "top-right":
                x, y = page_width - 100, 50
            elif position == "bottom-left":
                x, y = 50, page_height - 50
            elif position == "bottom-right":
                x, y = page_width - 100, page_height - 50
            else:
                x, y = page_width / 2, page_height - 50  # bottom-center
            
            page.insert_text((x, y), str(number), fontsize=font_size, color=color_rgb)
        
        output_buffer = pdf_doc.tobytes()
        pdf_doc.close()
        return output_buffer
    except Exception as e:
        print(f"Error adding page numbers: {e}")
        return None


def add_watermark(pdf_bytes: bytes, text: str, font_size: int, color: str) -> bytes:
    """Adds a watermark to all pages of a PDF."""
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        color_rgb = tuple(int(color[i:i+2], 16)/255 for i in (1, 3, 5))
        
        for page in pdf_doc:
            page_width = page.rect.width
            page_height = page.rect.height
            # Center the watermark
            x = page_width / 2
            y = page_height / 2
            page.insert_text((x, y), text, fontsize=font_size, color=color_rgb, rotate=45, opacity=0.5)
        
        output_buffer = pdf_doc.tobytes()
        pdf_doc.close()
        return output_buffer
    except Exception as e:
        print(f"Error adding watermark: {e}")
        return None


def repair_pdf(pdf_bytes: bytes) -> bytes:
    """Repairs a corrupted PDF."""
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        output_buffer = pdf_doc.tobytes()
        pdf_doc.close()
        return output_buffer
    except Exception as e:
        print(f"Error repairing PDF: {e}")
        return None


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts text from a PDF."""
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = ""
        for page in pdf_doc:
            text += page.get_text()
        pdf_doc.close()
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""


# Placeholder for other conversions - would need additional libraries
def convert_pdf_to_word(pdf_bytes: bytes) -> bytes:
    """Converts PDF to Word using pdf2docx."""
    try:
        import tempfile
        import os
        from pdf2docx import Converter
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as pdf_temp:
            pdf_temp.write(pdf_bytes)
            pdf_temp_path = pdf_temp.name
        
        docx_temp_path = pdf_temp_path.replace('.pdf', '.docx')
        
        cv = Converter(pdf_temp_path)
        cv.convert(docx_temp_path, start=0, end=None)
        cv.close()
        
        with open(docx_temp_path, 'rb') as f:
            docx_bytes = f.read()
        
        os.unlink(pdf_temp_path)
        os.unlink(docx_temp_path)
        
        return docx_bytes
    except Exception as e:
        print(f"Error converting PDF to Word: {e}")
        return None


def convert_word_to_pdf(word_bytes: bytes) -> bytes:
    """Converts Word to PDF (placeholder)."""
    # Implement using python-docx and reportlab or similar
    return b""  # Placeholder


def convert_pdf_to_excel(pdf_bytes: bytes) -> bytes:
    """Converts PDF to Excel (placeholder)."""
    return b""  # Placeholder


def convert_excel_to_pdf(excel_bytes: bytes) -> bytes:
    """Converts Excel to PDF using openpyxl and reportlab."""
    try:
        # Load the Excel file
        wb = load_workbook(io.BytesIO(excel_bytes))
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        for sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            # Add sheet title
            elements.append(Paragraph(f"Sheet: {sheet_name}", styles['Heading1']))

            # Extract data
            data = []
            for row in ws.iter_rows(values_only=True):
                data.append([str(cell) if cell is not None else '' for cell in row])

            if data:
                # Create table
                table = Table(data)
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 14),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ]))
                elements.append(table)
            elements.append(Paragraph("", styles['Normal']))  # Spacer

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
    except Exception as e:
        print(f"Error converting Excel to PDF: {e}")
        return None


def convert_pdf_to_pptx(pdf_bytes: bytes) -> bytes:
    """Converts PDF to PowerPoint (placeholder)."""
    return b""  # Placeholder


def convert_pptx_to_pdf(pptx_bytes: bytes) -> bytes:
    """Converts PowerPoint to PDF (placeholder)."""
    return b""  # Placeholder
# def split_pdf(file_path: str, ranges: str):
#     pass

# def merge_pdfs(file_paths: list):
#     pass

# def lock_pdf(file_path: str, password: str):
#     pass

# def unlock_pdf(file_path: str, password: str):
#     pass

