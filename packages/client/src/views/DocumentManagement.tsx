import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DocumentCategory, Document } from '../types/document';

const DocumentManagement: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<DocumentCategory>(DocumentCategory.REGULATION);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    fetchDocuments(currentCategory);
  }, [currentCategory]);

  const fetchDocuments = async (category: DocumentCategory) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/documents?category=${category}`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('获取文档失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (doc: Document) => {
    setPreviewUrl(doc.previewUrl);
    setPreviewTitle(doc.title);
    setPreviewOpen(true);
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Box sx={{ height: 'calc(100vh - 32px)', overflow: 'hidden' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>资料管理</Typography>
      
      <Tabs 
        value={currentCategory}
        onChange={(_, value) => setCurrentCategory(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        {Object.values(DocumentCategory).map((category) => (
          <Tab key={category} label={category} value={category} />
        ))}
      </Tabs>

      <TableContainer component={Paper} sx={{ height: 'calc(100% - 140px)', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>文档名称</TableCell>
              <TableCell>描述</TableCell>
              <TableCell>上传时间</TableCell>
              <TableCell>文件大小</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : documents && documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.description}</TableCell>
                  <TableCell>{new Date(doc.uploadTime).toLocaleDateString()}</TableCell>
                  <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handlePreview(doc)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDownload(doc.fileUrl)}>
                      <GetAppIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary">
                    暂无文档
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {previewTitle}
          <IconButton
            onClick={() => setPreviewOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <iframe
            src={previewUrl}
            style={{ width: '100%', height: '80vh', border: 'none' }}
            title="文档预览"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DocumentManagement; 