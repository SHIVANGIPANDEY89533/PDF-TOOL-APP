# 📄 PDF Tools API Documentation

This document provides details on the available API endpoints for the
**PDF Tools** service.

------------------------------------------------------------------------

## 🌐 Base URL

    http://127.0.0.1:8000/api/v1

------------------------------------------------------------------------

## 1️⃣ Add Text to PDF

Adds a custom text overlay to each page of an uploaded PDF file.

### **Endpoint**

    POST /edit/add-text

### **Content-Type**

`multipart/form-data`

### **Request Body**

  ------------------------------------------------------------------------
  Parameter           Type      Required           Description
  ------------------- --------- ------------------ -----------------------
  file                File      ✅ Yes             The PDF file to modify.

  text                String    ❌ No              The text to add.
                                                   Defaults to
                                                   "CONFIDENTIAL".

  font_size           Integer   ❌ No              The font size of the
                                                   text. Defaults to 50.

  x_pos               Integer   ❌ No              The X-coordinate for
                                                   the text position.
                                                   Defaults to 50.

  y_pos               Integer   ❌ No              The Y-coordinate for
                                                   the text position.
                                                   Defaults to 50.
  ------------------------------------------------------------------------

### **Responses**

  Status                      Description
  --------------------------- ----------------------------------------------------
  200 OK                      Returns the modified PDF file (`application/pdf`).
  500 Internal Server Error   If the PDF processing fails.

### **Example Usage (cURL)**

``` bash
curl -X POST "http://127.0.0.1:8000/api/v1/edit/add-text" -F "file=@/path/to/your/document.pdf" -F "text=Hello World" -F "font_size=24" --output modified_document.pdf
```

------------------------------------------------------------------------

## 2️⃣ Convert PDF to Image

Converts each page of an uploaded PDF into a PNG image and returns them
bundled in a ZIP file.

### **Endpoint**

    POST /convert/pdf-to-image

### **Content-Type**

`multipart/form-data`

### **Request Body**

  Parameter   Type   Required   Description
  ----------- ------ ---------- --------------------------
  file        File   ✅ Yes     The PDF file to convert.

### **Responses**

  -----------------------------------------------------------------------
  Status                      Description
  --------------------------- -------------------------------------------
  200 OK                      Returns a ZIP file containing the output
                              images (`application/zip`).

  500 Internal Server Error   If the conversion fails.
  -----------------------------------------------------------------------

### **Example Usage (cURL)**

``` bash
curl -X POST "http://127.0.0.1:8000/api/v1/convert/pdf-to-image" -F "file=@/path/to/your/document.pdf" --output converted_images.zip
```

------------------------------------------------------------------------

## 3️⃣ Convert Image(s) to PDF

Combines one or more uploaded image files into a single, multi-page PDF
document.

### **Endpoint**

    POST /convert/image-to-pdf

### **Content-Type**

`multipart/form-data`

### **Request Body**

  -----------------------------------------------------------------------------
  Parameter           Type           Required           Description
  ------------------- -------------- ------------------ -----------------------
  files               List\[File\]   ✅ Yes             One or more image files
                                                        (.jpg, .png, etc.) to
                                                        combine.

  -----------------------------------------------------------------------------

### **Responses**

  Status                      Description
  --------------------------- -----------------------------------------------------
  200 OK                      Returns the generated PDF file (`application/pdf`).
  500 Internal Server Error   If the conversion fails.

### **Example Usage (cURL)**

``` bash
curl -X POST "http://127.0.0.1:8000/api/v1/convert/image-to-pdf" -F "files=@/path/to/your/image1.jpg" -F "files=@/path/to/your/image2.png" --output converted_document.pdf
```

------------------------------------------------------------------------

## 🧾 Summary

  Feature           Input    Output
  ----------------- -------- ------------------
  Add Text to PDF   PDF      Modified PDF
  PDF to Image      PDF      ZIP (PNG Images)
  Image to PDF      Images   Combined PDF

------------------------------------------------------------------------

## 🧑‍💻 Author

**Sonalika Chaudhari**
