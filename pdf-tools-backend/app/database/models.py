from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
import datetime
import uuid

Base = declarative_base()

class PDFJob(Base):
    __tablename__ = "pdf_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(String(20), nullable=False, default="uploaded")
    source_s3_key = Column(String(255), nullable=False)
    result_s3_key = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)