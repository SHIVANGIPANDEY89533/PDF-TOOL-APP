from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse, Response
import os, io, uuid, time, shutil, zipfile, fitz, json, tempfile, subprocess
from PyPDF2 import PdfReader, PdfWriter
from pdf2docx import Converter
from docx import Document
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from app.processing.operations import add_text_to_pdf_file
from app.processing.operations import convert_pdf_to_images
from app.processing.operations import convert_images_to_pdf
from app.processing.operations import compress_pdf
from app.processing.operations import rotate_pdf
from app.processing.operations import add_page_numbers
from app.processing.operations import add_watermark
from app.processing.operations import repair_pdf
from app.processing.operations import extract_text_from_pdf
from app.processing.operations import convert_excel_to_pdf
from app.processing.operations import convert_pdf_to_excel
import threading

# ✅ Router setup
router = APIRouter()

# ================================
# ✅ Temporary directories
# ================================
TEMP_DIRS = ["uploads", "pdf_to_word", "word_to_pdf", "locked_pdfs", "split_pdfs", "merged_pdfs"]
for d in TEMP_DIRS:
    os.makedirs(d, exist_ok=True)

# ================================
# ✅ Helper: Delete file after delay
# ================================
def delete_file_later(file_path: str, delay_seconds: int = 600):
    """Delete a file after a delay (default 10 minutes)."""
    def _delete():
        time.sleep(delay_seconds)
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted file: {file_path}")
    threading.Thread(target=_delete, daemon=True).start()


def convert_using_unoconv(input_bytes: bytes, input_ext: str, output_ext: str) -> bytes:
    converter = shutil.which("unoconv")
    if not converter:
        raise RuntimeError("unoconv is not installed on the server. Excel/PPT conversion is unavailable.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=input_ext) as src_file:
        src_file.write(input_bytes)
        src_path = src_file.name

    output_path = os.path.splitext(src_path)[0] + output_ext
    try:
        subprocess.run([converter, "-f", output_ext.lstrip("."), "-o", output_path, src_path], check=True, capture_output=True, text=True)
        with open(output_path, "rb") as f:
            return f.read()
    finally:
        if os.path.exists(src_path):
            os.remove(src_path)
        if os.path.exists(output_path):
            os.remove(output_path)


# ================================
# ✅ Root
# ================================
# @router.get("/")
# def root():
#     return {"message": "Welcome to PDF Tools API"}

@router.get("/welcome")
async def welcome_message():
    return {"message": "Welcome to PDF Tools API!"}


# ================================
# PDF → Word
# ================================
@router.post("/convert/pdf-to-word-download")
async def pdf_to_word_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    temp_dir = "pdf_to_word"
    pdf_path = os.path.join(temp_dir, f"{uuid.uuid4()}.pdf")
    docx_path = os.path.join(temp_dir, f"{uuid.uuid4()}.docx")

    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    with open(pdf_path, "wb") as f:
        f.write(pdf_bytes)

    cv = Converter(pdf_path)
    cv.convert(docx_path, start=0, end=None)
    cv.close()

    if not os.path.exists(docx_path) or os.path.getsize(docx_path) == 0:
        raise HTTPException(status_code=500, detail="Conversion failed")

    # Schedule deletion
    if background_tasks:
        background_tasks.add_task(delete_file_later, pdf_path)
        background_tasks.add_task(delete_file_later, docx_path)

    return FileResponse(docx_path, filename=os.path.basename(docx_path),
                        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


# ================================
# Word → PDF
# ================================
def docx_to_pdf(word_path: str, output_path: str):
    try:
        doc = Document(word_path)
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4
        y = height - 50
        for para in doc.paragraphs:
            text = para.text.strip()
            if text:
                c.drawString(50, y, text)
                y -= 20
                if y < 50:
                    c.showPage()
                    y = height - 50
        c.save()
        return output_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@router.post("/convert/word-to-pdf-download")
async def word_to_pdf_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    TEMP_DIR = "word_to_pdf"
    word_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}.docx")
    pdf_filename = f"{uuid.uuid4()}.pdf"
    pdf_path = os.path.join(TEMP_DIR, pdf_filename)

    word_bytes = await file.read()
    if not word_bytes:
        raise HTTPException(status_code=400, detail="Uploaded Word file is empty")
    with open(word_path, "wb") as f:
        f.write(word_bytes)

    docx_to_pdf(word_path, pdf_path)

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="PDF not generated")

    # Schedule deletion
    if background_tasks:
        background_tasks.add_task(delete_file_later, word_path)
        background_tasks.add_task(delete_file_later, pdf_path)

    return FileResponse(pdf_path, filename=pdf_filename, media_type="application/pdf")


# ================================
# Lock PDF
# ================================
@router.post("/lock-pdf")
async def lock_pdf_download(file: UploadFile = File(...), password: str = Form(...), background_tasks: BackgroundTasks = None):
    temp_dir = "locked_pdfs"
    input_pdf_path = os.path.join(temp_dir, f"{uuid.uuid4()}.pdf")
    output_pdf_path = os.path.join(temp_dir, f"locked_{uuid.uuid4()}.pdf")

    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    with open(input_pdf_path, "wb") as f:
        f.write(pdf_bytes)

    reader = PdfReader(input_pdf_path)
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    writer.encrypt(password)
    with open(output_pdf_path, "wb") as f:
        writer.write(f)

    # Schedule deletion
    if background_tasks:
        background_tasks.add_task(delete_file_later, input_pdf_path)
        background_tasks.add_task(delete_file_later, output_pdf_path)

    return FileResponse(output_pdf_path, filename=os.path.basename(output_pdf_path), media_type="application/pdf")


# ================================
# Merge PDF
# ================================
@router.post("/mergePDF")
async def merge_pdf_download(files: list[UploadFile] = File(...), background_tasks: BackgroundTasks = None):
    try:
        temp_dir = "merged_pdfs"
        output_path = os.path.join(temp_dir, f"merged_{uuid.uuid4()}.pdf")
        writer = PdfWriter()
        temp_files = []

        for file in files:
            if file:
                try:
                    pdf_path = os.path.join(temp_dir, f"{uuid.uuid4()}.pdf")
                    with open(pdf_path, "wb") as f:
                        pdf_content = await file.read()
                        f.write(pdf_content)
                    temp_files.append(pdf_path)
                    reader = PdfReader(pdf_path)
                    for page in reader.pages:
                        writer.add_page(page)
                except Exception as e:
                    print(f"Error processing file {file.filename}: {e}")
                    raise HTTPException(status_code=400, detail=f"Error processing {file.filename}: {str(e)}")

        with open(output_path, "wb") as f:
            writer.write(f)

        # Schedule deletion
        if background_tasks:
            for f in temp_files:
                background_tasks.add_task(delete_file_later, f)
            background_tasks.add_task(delete_file_later, output_path)

        return FileResponse(output_path, filename="merged.pdf", media_type="application/pdf")
    
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Merge error: {e}")
        raise HTTPException(status_code=500, detail=f"Merge failed: {str(e)}")


# ================================
# Split PDF (all pages)
# ================================
@router.post("/splitPDF")
async def split_pdf_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    temp_dir = "split_pdfs"
    input_pdf_path = os.path.join(temp_dir, f"{uuid.uuid4()}.pdf")
    with open(input_pdf_path, "wb") as f:
        f.write(await file.read())

    reader = PdfReader(input_pdf_path)
    zip_path = os.path.join(temp_dir, f"split_{uuid.uuid4()}.zip")
    page_paths = []

    with zipfile.ZipFile(zip_path, "w") as zipf:
        for i, page in enumerate(reader.pages):
            writer = PdfWriter()
            writer.add_page(page)
            page_path = os.path.join(temp_dir, f"page_{i+1}.pdf")
            page_paths.append(page_path)
            with open(page_path, "wb") as pf:
                writer.write(pf)
            zipf.write(page_path, f"page_{i+1}.pdf")

    # Schedule deletion
    if background_tasks:
        background_tasks.add_task(delete_file_later, input_pdf_path)
        background_tasks.add_task(delete_file_later, zip_path)
        for p in page_paths:
            background_tasks.add_task(delete_file_later, p)

    return FileResponse(zip_path, filename=os.path.basename(zip_path), media_type="application/zip")


# ================================
# Unlock PDF
# ================================
@router.post("/unlock-pdf")
async def unlock_pdf_download(file: UploadFile = File(...), password: str = Form(""), background_tasks: BackgroundTasks = None):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")

    pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    if pdf_doc.is_encrypted:
        if not password or not pdf_doc.authenticate(password):
            raise HTTPException(status_code=400, detail="Invalid password")

    output_path = os.path.join("uploads", f"unlocked_{uuid.uuid4()}.pdf")
    pdf_doc.save(output_path)
    pdf_doc.close()

    # Schedule deletion
    if background_tasks:
        background_tasks.add_task(delete_file_later, output_path)

    return FileResponse(output_path, filename=os.path.basename(output_path), media_type="application/pdf")


# ================================
# Split PDF by Ranges
# ================================
@router.post("/split-pdf-ranges")
async def split_pdf_ranges(file: UploadFile = File(...), ranges: str = Form(...), background_tasks: BackgroundTasks = None):
    reader = PdfReader(io.BytesIO(await file.read()))
    try:
        ranges = json.loads(ranges)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ranges JSON")

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zipf:
        for i, r in enumerate(ranges, start=1):
            if not str(r.get("from", "")).strip() or not str(r.get("to", "")).strip():
                raise HTTPException(status_code=400, detail=f"Range {i} must include both 'from' and 'to' values")
            try:
                start_page = int(r["from"]) - 1
                end_page = int(r["to"])
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Range {i} contains invalid page numbers")
            if start_page < 0 or end_page <= start_page:
                raise HTTPException(status_code=400, detail=f"Range {i} is invalid: 'from' must be less than 'to'")

            writer = PdfWriter()
            for page_num in range(start_page, end_page):
                if 0 <= page_num < len(reader.pages):
                    writer.add_page(reader.pages[page_num])
            pdf_part = io.BytesIO()
            writer.write(pdf_part)
            zipf.writestr(f"range_{i}.pdf", pdf_part.getvalue())

    zip_buffer.seek(0)
    return StreamingResponse(zip_buffer, media_type="application/zip",
                             headers={"Content-Disposition": f"attachment; filename=split_ranges.zip"})


# ================================
# Preview PDF
# ================================
@router.post("/upload-pdf-preview")
async def upload_pdf_preview(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join("uploads", f"{file_id}.pdf")
    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    doc = fitz.open(pdf_path)
    pages = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=fitz.Matrix(0.2, 0.2))
        img_name = f"{file_id}_{i}.png"
        img_path = os.path.join("uploads", img_name)
        pix.save(img_path)
        pages.append({"id": f"{file_id}_{i}", "previewUrl": f"/static/{img_name}", "pageNumber": i + 1})
        # Schedule deletion for preview image
        if background_tasks:
            background_tasks.add_task(delete_file_later, img_path)
    doc.close()

    # Schedule deletion for PDF
    if background_tasks:
        background_tasks.add_task(delete_file_later, pdf_path)

    return {"fileId": file_id, "pages": pages}


# ================================
# Download Endpoint
# ================================
@router.get("/download/{filename}")
async def download_file(filename: str, disposition: str = "inline"):
    for d in TEMP_DIRS:
        p = os.path.join(d, filename)
        if os.path.exists(p):
            resp = FileResponse(p, media_type="application/pdf", filename=filename)
            resp.headers["Content-Disposition"] = f'{disposition}; filename="{filename}"'
            return resp
    raise HTTPException(status_code=404, detail="File not found")


# ================================
# Reorganize PDF
# ================================
@router.post("/reorganize-pdfs-download")
async def reorganize_pdfs_download(files: list[UploadFile] = File(...), order: str = Form(...), background_tasks: BackgroundTasks = None):
    try:
        order_list = json.loads(order)
        writer = PdfWriter()
        temp_files = []

        for pdf in files:
            temp_path = os.path.join("uploads", f"{uuid.uuid4()}_{pdf.filename}")
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(pdf.file, buffer)
            temp_files.append(temp_path)

        for item in order_list:
            idx = item.get("sourceIndex")
            page_number = item.get("pageNumber")
            if idx is None or page_number is None or idx >= len(temp_files):
                continue
            reader = PdfReader(temp_files[idx])
            if 0 <= page_number - 1 < len(reader.pages):
                writer.add_page(reader.pages[page_number - 1])

        output_filename = f"reorganized_{uuid.uuid4()}.pdf"
        output_path = os.path.join("uploads", output_filename)
        with open(output_path, "wb") as f:
            writer.write(f)

        # Schedule deletion
        if background_tasks:
            for f in temp_files:
                background_tasks.add_task(delete_file_later, f)
            background_tasks.add_task(delete_file_later, output_path)

        return FileResponse(output_path, media_type="application/pdf", filename="Reorganized.pdf")
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


# ================================
# Edit PDF - Add Text
# ================================
@router.post("/edit/add-text")
async def add_text_to_pdf(
    file: UploadFile = File(...), 
    text: str = Form("CONFIDENTIAL"), 
    font_size: int = Form(50),
    x_pos: int = Form(50),
    y_pos: int = Form(50),
    background_tasks: BackgroundTasks = None
):
    pdf_bytes = await file.read()
    edited_pdf_bytes = add_text_to_pdf_file(
        pdf_bytes=pdf_bytes,
        text=text,
        font_size=font_size,
        x_pos=x_pos,
        y_pos=y_pos
    )
    if not edited_pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to process the PDF.")

    # Save temp file to delete later
    temp_path = os.path.join("uploads", f"edited_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(edited_pdf_bytes)

    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)

    return FileResponse(
        temp_path, 
        media_type="application/pdf",
        filename=f"edited_{file.filename}"
    )


# ================================
# Compress PDF
# ================================
@router.post("/compress/pdf")
async def compress_pdf_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    
    compressed_pdf_bytes = compress_pdf(pdf_bytes)
    if not compressed_pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to compress PDF.")
    
    temp_path = os.path.join("uploads", f"compressed_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(compressed_pdf_bytes)
    
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    
    return FileResponse(temp_path, media_type="application/pdf", filename="compressed.pdf")


# ================================
# Rotate PDF
# ================================
@router.post("/edit/rotate")
async def rotate_pdf_download(
    file: UploadFile = File(...), 
    rotation: int = Form(90), 
    pages: str = Form("all"), 
    background_tasks: BackgroundTasks = None
):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    
    rotated_pdf_bytes = rotate_pdf(pdf_bytes, rotation, pages)
    if not rotated_pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to rotate PDF.")
    
    temp_path = os.path.join("uploads", f"rotated_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(rotated_pdf_bytes)
    
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    
    return FileResponse(temp_path, media_type="application/pdf", filename="rotated.pdf")


# ================================
# Add Page Numbers
# ================================
@router.post("/edit/page-numbers")
async def add_page_numbers_download(
    file: UploadFile = File(...), 
    position: str = Form("bottom-right"), 
    start_number: int = Form(1), 
    font_size: int = Form(12), 
    color: str = Form("#000000"), 
    background_tasks: BackgroundTasks = None
):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    
    numbered_pdf_bytes = add_page_numbers(pdf_bytes, position, start_number, font_size, color)
    if not numbered_pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to add page numbers.")
    
    temp_path = os.path.join("uploads", f"numbered_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(numbered_pdf_bytes)
    
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    
    return FileResponse(temp_path, media_type="application/pdf", filename="numbered.pdf")


# ================================
# Add Watermark
# ================================
@router.post("/edit/watermark")
async def add_watermark_download(
    file: UploadFile = File(...), 
    text: str = Form("WATERMARK"), 
    font_size: int = Form(50), 
    color: str = Form("#FF0000"), 
    background_tasks: BackgroundTasks = None
):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    
    watermarked_pdf_bytes = add_watermark(pdf_bytes, text, font_size, color)
    if not watermarked_pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to add watermark.")
    
    temp_path = os.path.join("uploads", f"watermarked_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(watermarked_pdf_bytes)
    
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    
    return FileResponse(temp_path, media_type="application/pdf", filename="watermarked.pdf")


# ================================
# Repair PDF
# ================================
@router.post("/repair/pdf")
async def repair_pdf_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    
    repaired_pdf_bytes = repair_pdf(pdf_bytes)
    if not repaired_pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to repair PDF.")
    
    temp_path = os.path.join("uploads", f"repaired_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(repaired_pdf_bytes)
    
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    
    return FileResponse(temp_path, media_type="application/pdf", filename="repaired.pdf")


# ================================
# Extract Text
# ================================
@router.post("/extract-text")
async def extract_text_download(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    
    try:
        pdf_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages = []
        for i, page in enumerate(pdf_doc, start=1):
            page_text = page.get_text()
            pages.append({"page": i, "text": page_text})
        pdf_doc.close()
        return {"pages": pages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")


# ================================
# PDF → Image
# ================================
@router.post("/convert/pdf-to-image")
async def pdf_to_image_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty")
    images = convert_pdf_to_images(pdf_bytes)
    if not images:
        raise HTTPException(status_code=500, detail="Failed to convert PDF to images.")

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for filename, data in images.items():
            zipf.writestr(filename, data)
    zip_buffer.seek(0)

    # Save zip temporarily to delete later
    temp_zip = os.path.join("uploads", f"converted_images_{uuid.uuid4()}.zip")
    with open(temp_zip, "wb") as f:
        f.write(zip_buffer.getvalue())
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_zip)

    return FileResponse(
        temp_zip,
        media_type="application/zip",
        filename="converted_images.zip"
    )


# ================================
# Image → PDF
# ================================
@router.post("/convert/image-to-pdf")
async def image_to_pdf_download(files: list[UploadFile] = File(...), background_tasks: BackgroundTasks = None):
    if not files:
        raise HTTPException(status_code=400, detail="No image files uploaded.")
    
    image_bytes_list = [await file.read() for file in files]
    pdf_bytes = convert_images_to_pdf(image_bytes_list)
    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to convert images to PDF.")
    
    temp_path = os.path.join("uploads", f"converted_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(pdf_bytes)
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)

    return FileResponse(
        temp_path,
        media_type="application/pdf",
        filename="converted.pdf"
    )


@router.post("/convert/excel-to-pdf")
async def excel_to_pdf_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    excel_bytes = await file.read()
    if not excel_bytes:
        raise HTTPException(status_code=400, detail="Uploaded Excel file is empty")
    try:
        pdf_bytes = convert_excel_to_pdf(excel_bytes)
        if not pdf_bytes:
            raise HTTPException(status_code=500, detail="Excel to PDF conversion failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Excel to PDF conversion failed: {e}")

    temp_path = os.path.join("uploads", f"excel_to_pdf_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(pdf_bytes)
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    return FileResponse(temp_path, media_type="application/pdf", filename="converted.pdf")


@router.post("/convert/pdf-to-excel")
async def pdf_to_excel_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF file is empty")
    try:
        excel_bytes = convert_using_unoconv(pdf_bytes, ".pdf", ".xlsx")
    except RuntimeError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF to Excel conversion failed: {e}")

    temp_path = os.path.join("uploads", f"pdf_to_excel_{uuid.uuid4()}.xlsx")
    with open(temp_path, "wb") as f:
        f.write(excel_bytes)
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    return FileResponse(temp_path, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename="converted.xlsx")


@router.post("/convert/pdf-to-pptx")
async def pdf_to_pptx_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF file is empty")
    try:
        pptx_bytes = convert_using_unoconv(pdf_bytes, ".pdf", ".pptx")
    except RuntimeError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF to PowerPoint conversion failed: {e}")

    temp_path = os.path.join("uploads", f"pdf_to_pptx_{uuid.uuid4()}.pptx")
    with open(temp_path, "wb") as f:
        f.write(pptx_bytes)
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    return FileResponse(temp_path, media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", filename="converted.pptx")


@router.post("/convert/pptx-to-pdf")
async def pptx_to_pdf_download(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    pptx_bytes = await file.read()
    if not pptx_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PowerPoint file is empty")
    try:
        pdf_bytes = convert_using_unoconv(pptx_bytes, ".pptx", ".pdf")
    except RuntimeError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PowerPoint to PDF conversion failed: {e}")

    temp_path = os.path.join("uploads", f"pptx_to_pdf_{uuid.uuid4()}.pdf")
    with open(temp_path, "wb") as f:
        f.write(pdf_bytes)
    if background_tasks:
        background_tasks.add_task(delete_file_later, temp_path)
    return FileResponse(temp_path, media_type="application/pdf", filename="converted.pdf")


# @router.post("/extract-alltext")
# async def extract_text_from_pdf(file: UploadFile = File(...)):
#     import fitz  # PyMuPDF
#     pdf_bytes = await file.read()
#     pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
    
#     full_text = ""
#     for page in pdf:
#         full_text += page.get_text()
    
#     return {"text": full_text}


# router = APIRouter()
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# @router.post("/extract-text-positions")
# async def extract_text_positions(file: UploadFile = File(...)):
#     if not file.filename.endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDFs allowed")

#     pdf_bytes = await file.read()
#     pdf = fitz.open(stream=pdf_bytes, filetype="pdf")

#     pages_data = []

#     for page_number, page in enumerate(pdf, start=1):
#         words = page.get_text("words")  # x0, y0, x1, y1, word, ...
#         words_data = [
#             {
#                 "text": w[4],
#                 "x": w[0],
#                 "y": w[1],
#                 "width": w[2] - w[0],
#                 "height": w[3] - w[1],
#                 "id": f"{page_number}_{i}",
#                 "page": page_number,
#             }
#             for i, w in enumerate(words)
#         ]
#         pages_data.append({"page": page_number, "words": words_data})

#     pdf.close()
#     return {"pages": pages_data}


# @router.post("/apply-changes")
# async def apply_changes(file: UploadFile = File(...), edits: str = Form(...)):
#     edits = json.loads(edits)  # [{page, x, y, text, width, height}, ...]

#     pdf_bytes = await file.read()
#     doc = fitz.open(stream=pdf_bytes, filetype="pdf")

#     for edit in edits:
#         page_index = edit["page"] - 1
#         if page_index >= len(doc):
#             continue
#         page = doc[page_index]

#         # Cover old text
#         rect = fitz.Rect(edit["x"], edit["y"], edit["x"] + edit["width"], edit["y"] + edit["height"])
#         page.draw_rect(rect, color=(1, 1, 1), fill=(1, 1, 1))

#         # Insert new text
#         page.insert_text(
#             (edit["x"], edit["y"] + edit["height"] * 0.2),  # adjust y to align
#             edit["text"],
#             fontsize=edit["height"] * 0.7,
#             color=(0, 0, 0)
#         )

#     temp_path = os.path.join(UPLOAD_DIR, f"edited_{uuid.uuid4().hex}.pdf")
#     doc.save(temp_path)
#     doc.close()

#     return FileResponse(temp_path, filename=f"edited_{file.filename}", media_type="application/pdf")