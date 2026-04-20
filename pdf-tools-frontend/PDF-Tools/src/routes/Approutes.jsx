// src/routes/Approutes.jsx
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Homepg from '../pages/Homepg';
import Navbar from "../component/Common/Navbar";
import Convert from "../pages/Convert";
import LockAndUnlock from "../pages/LockAndUnlock";
import Mergepage from "../pages/Mergepage";
import ConversionToPDF from "../pages/conversionToPDF";
import ConversionToWord from '../pages/ConversionToWord';
import MergeInterface from "../pages/MergeInterface"
import WordToPDF1 from '../pages/WordToPDF1';
import WordToPDF2 from "../pages/wordToPDF2";
import Footer from '../component/Common/Footer';
import PagePreviewSection from '../pages/PagePreviewSection';
import MergeAndSplit from "../pages/MergeAndSplit";
import SplitInterface from '../pages/splitInterface';
import SplitPage from "../pages/SplitPage"
import ReOrganizeUploadPage from "../pages/Re-OrganizeUploadPage" 
import LockingPDF from "../pages/lockingPDF"
import UnlockPDF from "../pages/unlockPDF"
import Unlockinginterface from '../pages/Unlockinginterface';
import LockingInterface from "../pages/lockingInterface"
import PdfToImageInterface from '../pages/PdfToImageInterface';
import ImageToPDFInterface from '../pages/ImageToPDFInterface';
import Edit from '../pages/Edit';
import EditPDFPage from '../pages/EditPDFPage';
import Matedata from '../pages/Matedata';
import CompressPDF from '../pages/CompressPDF';
import RotatePDFInterface from '../pages/RotatePDFInterface';
import PageNumbersInterface from '../pages/PageNumbersInterface';
import WatermarkInterface from '../pages/WatermarkInterface';
import RepairPDFInterface from '../pages/RepairPDFInterface';
import ExcelToPdfInterface from '../pages/ExcelToPdfInterface';
import PdfToExcelInterface from '../pages/PdfToExcelInterface';
import PdfToPptInterface from '../pages/PdfToPptInterface';
import PptToPdfInterface from '../pages/PptToPdfInterface';
import Comingsoon from '../pages/comingsoon';



const Approutes = () => {
  return (
 <>
    <BrowserRouter>
    <Navbar/>

    <Routes>
      <Route path="/" element={<Homepg/>} />
       <Route path="/lockandunlock" element={<LockAndUnlock/>} />
        <Route path="/convert" element={<Convert/>} />
      <Route path="/merge" element={<Mergepage/>}/>
      <Route path="/conversionToPDF" element={<ConversionToPDF/>}/>
      <Route path="/conversionToWord" element={<ConversionToWord/>}/>
      <Route path="/mergeInterface" element={<MergeInterface/>}/>
      <Route path="/wordToPDF1" element={<WordToPDF1/>}/>
      <Route path="/wordToPDF2" element={<WordToPDF2/>}/>
      <Route path="/pagePreviewSection" element={<PagePreviewSection/>} />
      <Route path="/splitInterface" element={<SplitInterface/>} />
      <Route path="/mergeAndSplit" element={<MergeAndSplit/>}/>
      <Route path="/splitPage" element={<SplitPage/>}/>
      <Route path="/ReOrganizeUploadPage" element={<ReOrganizeUploadPage/>}/>
      <Route path="/lockingPDF" element={<LockingPDF/>}/>
      <Route path="/unlockPdf" element={<UnlockPDF/>}/>
      <Route path="/unlockinginterface" element={<Unlockinginterface/>}/>
      <Route path="/lockinginterface" element={<LockingInterface/>}/>
      <Route path='/pdftoimage' element={<PdfToImageInterface/>}/>
      <Route path='/imagetopdf' element={<ImageToPDFInterface/>}/>
      <Route path='/edit' element={<Edit/>}/>
      <Route path='/editpdf' element={<EditPDFPage/>}/>
      <Route path='/matedata' element={<Matedata/>}/>
      <Route path='/compress' element={<CompressPDF/>}/>
      <Route path='/rotate' element={<RotatePDFInterface/>}/>
      <Route path='/page-numbers' element={<PageNumbersInterface/>}/>
      <Route path='/watermark' element={<WatermarkInterface/>}/>
      <Route path='/repair' element={<RepairPDFInterface/>}/>
      <Route path='/excel-to-pdf' element={<ExcelToPdfInterface/>}/>
      <Route path='/pdf-to-excel' element={<PdfToExcelInterface/>}/>
      <Route path='/pdf-to-pptx' element={<PdfToPptInterface/>}/>
      <Route path='/pptx-to-pdf' element={<PptToPdfInterface/>}/>
      <Route path="/comingsoon" element={<Comingsoon/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
 </>
  );
};

export default Approutes;
