import { useState, useRef, useEffect } from "react";
import { useDataStore } from "@/store/useDataStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconUpload, IconFileSpreadsheet, IconAlertCircle } from "@tabler/icons-react";
import * as XLSX from "xlsx";

type PreviewData = {
  "PO Number": string;
  "VendorName": string;
  "OrderedQty": string;
  "ReceivedQty": string;
  "PoAmount": string;
};

type UploadStatus = {
  type: 'success' | 'error';
  message: string;
};

type ParsedPO = {
  poNumber: string;
  vendor: string;
  orderedQty: number;
  receivedQty: number;
  poAmount: number;
};

type FileRow = {
  [key: string]: string;
};

type UploadType = 'pos' | 'openpos';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [openFile, setOpenFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [openPreviewData, setOpenPreviewData] = useState<PreviewData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpenUploading, setIsOpenUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [openUploadStatus, setOpenUploadStatus] = useState<UploadStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openFileInputRef = useRef<HTMLInputElement>(null);
  const { pos, openpos, addPO, addOpenPO } = useDataStore();
  
  // Debug effect to log store state changes
  useEffect(() => {
    console.log('Store state updated - Regular POs:', pos, 'Open POs:', openpos);
  }, [pos, openpos]);

  const parseFile = (file: File): Promise<PreviewData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          let jsonData: PreviewData[] = [];
          
          if (file.name.endsWith('.csv')) {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 1) {
              reject(new Error('File is empty or invalid'));
              return;
            }
            
            // Improved CSV parsing that handles quoted fields
            const parseCSVLine = (line: string): string[] => {
              const result: string[] = [];
              let current = '';
              let inQuotes = false;
              
              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                  if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                    // Double quotes inside quoted field
                    current += '"';
                    i++; // Skip next quote
                  } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                  }
                } else if (char === ',' && !inQuotes) {
                  // End of field
                  result.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              
              // Add the last field
              result.push(current.trim());
              return result;
            };
            
            // Parse headers
            const headers = parseCSVLine(lines[0]);
            console.log('CSV Headers:', headers); // Debug log
            
            // Normalize headers to handle different formats
            const normalizedHeaders = headers.map(header => 
              header.trim().toLowerCase().replace(/\s+/g, '')
            );
            
            // Find indices for required fields
            const poNumberIndex = normalizedHeaders.findIndex(h => 
              h === 'ponumber' || h.includes('po') && h.includes('number')
            );
            
            const vendorNameIndex = normalizedHeaders.findIndex(h => 
              h === 'vendorname' || h.includes('vendor')
            );
            
            const orderedQtyIndex = normalizedHeaders.findIndex(h => 
              h === 'orderedqty' || h.includes('ordered') && (h.includes('qty') || h.includes('quantity'))
            );
            
            const receivedQtyIndex = normalizedHeaders.findIndex(h => 
              h === 'receivedqty' || h.includes('received') && (h.includes('qty') || h.includes('quantity'))
            );
            
            const poAmountIndex = normalizedHeaders.findIndex(h => 
              h === 'poamount' || h.includes('amount') || h.includes('value')
            );
            
            console.log('Header indices:', {
              poNumberIndex,
              vendorNameIndex,
              orderedQtyIndex,
              receivedQtyIndex,
              poAmountIndex
            }); // Debug log
            
            // Parse CSV rows
            for (let i = 1; i < lines.length; i++) {
              const values = parseCSVLine(lines[i]);
              console.log(`Row ${i} values:`, values); // Debug log
              
              if (values.length > 0 && values.some(v => v.trim() !== '')) {
                // Create object with expected format
                const mappedObj: PreviewData = {
                  "PO Number": poNumberIndex !== -1 && values[poNumberIndex] ? values[poNumberIndex].trim() : '',
                  "VendorName": vendorNameIndex !== -1 && values[vendorNameIndex] ? values[vendorNameIndex].trim() : '',
                  "OrderedQty": orderedQtyIndex !== -1 && values[orderedQtyIndex] ? values[orderedQtyIndex].trim() : '',
                  "ReceivedQty": receivedQtyIndex !== -1 && values[receivedQtyIndex] ? values[receivedQtyIndex].trim() : '',
                  "PoAmount": poAmountIndex !== -1 && values[poAmountIndex] ? values[poAmountIndex].trim() : '',
                };
                
                console.log('Mapped object:', mappedObj); // Debug log
                
                // Validate required fields
                const hasRequiredFields = mappedObj["PO Number"] && mappedObj["VendorName"] && 
                                        mappedObj["PO Number"].trim() !== '' && mappedObj["VendorName"].trim() !== '';
                
                if (hasRequiredFields) {
                  console.log('Adding valid row:', mappedObj); // Debug log
                  jsonData.push(mappedObj);
                } else {
                  console.log('Skipping invalid row - missing required fields:', mappedObj); // Debug log
                }
              }
            }
          } else {
            // Parse Excel files
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const sheetData: FileRow[] = XLSX.utils.sheet_to_json(worksheet);
            console.log('Excel sheet data:', sheetData); // Debug log
            
            // Convert to PreviewData format
            jsonData = sheetData.map(row => {
              // Get all possible keys from the row
              const keys = Object.keys(row);
              console.log('Excel row keys:', keys); // Debug log
              
              // Normalize keys for matching
              const normalizedKeys = keys.map(key => key.toLowerCase().replace(/\s+/g, ''));
              
              // Find the best matching keys
              const poNumberKey = keys.find((_, index) => 
                normalizedKeys[index] === 'ponumber' || 
                (normalizedKeys[index].includes('po') && normalizedKeys[index].includes('number'))
              ) || keys[0];
              
              const vendorNameKey = keys.find((_, index) => 
                normalizedKeys[index] === 'vendorname' || 
                normalizedKeys[index].includes('vendor')
              ) || keys[1];
              
              const orderedQtyKey = keys.find((_, index) => 
                normalizedKeys[index] === 'orderedqty' || 
                (normalizedKeys[index].includes('ordered') && 
                 (normalizedKeys[index].includes('qty') || normalizedKeys[index].includes('quantity')))
              ) || keys[2];
              
              const receivedQtyKey = keys.find((_, index) => 
                normalizedKeys[index] === 'receivedqty' || 
                (normalizedKeys[index].includes('received') && 
                 (normalizedKeys[index].includes('qty') || normalizedKeys[index].includes('quantity')))
              ) || keys[3];
              
              const poAmountKey = keys.find((_, index) => 
                normalizedKeys[index] === 'poamount' || 
                normalizedKeys[index].includes('amount') || 
                normalizedKeys[index].includes('value')
              ) || keys[4];
              
              const result = {
                "PO Number": String(row[poNumberKey] || ''),
                "VendorName": String(row[vendorNameKey] || ''),
                "OrderedQty": String(row[orderedQtyKey] || ''),
                "ReceivedQty": String(row[receivedQtyKey] || ''),
                "PoAmount": String(row[poAmountKey] || ''),
              };
              
              console.log('Mapped Excel row:', result); // Debug log
              return result;
            }).filter(row => {
              const isValid = row["PO Number"] && row["VendorName"] && 
                            row["PO Number"].trim() !== '' && row["VendorName"].trim() !== '';
              if (!isValid) console.log('Filtering out Excel row:', row); // Debug log
              return isValid;
            });
          }
          
          console.log('Final parsed data:', jsonData); // Debug log
          resolve(jsonData);
        } catch (error) {
          console.error('Error parsing file:', error);
          reject(new Error(`Error parsing file: ${(error as Error).message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file.'));
      };
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: UploadType) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (type === 'pos') {
        setFile(selectedFile);
        setUploadStatus(null);
      } else {
        setOpenFile(selectedFile);
        setOpenUploadStatus(null);
      }
      
      try {
        const parsedData = await parseFile(selectedFile);
        console.log('Parsed data:', parsedData); // Debug log
        if (parsedData.length === 0) {
          throw new Error('No valid data found in the file. Please check that your file contains the required columns: PO Number, VendorName, OrderedQty, ReceivedQty, PoAmount');
        }
        if (type === 'pos') {
          setPreviewData(parsedData.slice(0, 5));
        } else {
          setOpenPreviewData(parsedData.slice(0, 5));
        }
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error parsing file.';
        console.error('File parsing error:', error); // Debug log
        if (type === 'pos') {
          setUploadStatus({
            type: 'error',
            message: errorMessage
          });
          setPreviewData([]);
        } else {
          setOpenUploadStatus({
            type: 'error',
            message: errorMessage
          });
          setOpenPreviewData([]);
        }
      }
    }
  };

  const handleUpload = async (type: UploadType) => {
    const currentFile = type === 'pos' ? file : openFile;
    if (!currentFile) return;

    if (type === 'pos') {
      setIsUploading(true);
      setUploadStatus(null);
    } else {
      setIsOpenUploading(true);
      setOpenUploadStatus(null);
    }

    try {
      const parsedData = await parseFile(currentFile);
      console.log('Uploading parsed data:', parsedData); // Debug log
      
      // Convert parsed data to PO format
      const poData: ParsedPO[] = parsedData.map((row, index) => {
        console.log(`Processing row ${index}:`, row); // Debug log
        return {
          poNumber: row["PO Number"]?.toString().trim() || '',
          vendor: row["VendorName"]?.toString().trim() || '',
          orderedQty: parseInt(row["OrderedQty"]?.toString() || '0'),
          receivedQty: parseInt(row["ReceivedQty"]?.toString() || '0'),
          poAmount: parseFloat(row["PoAmount"]?.toString() || '0')
        };
      }).filter(po => {
        const isValid = po.poNumber && po.vendor && po.poNumber.trim() !== '' && po.vendor.trim() !== '';
        if (!isValid) console.log('Filtering out invalid PO:', po); // Debug log
        return isValid;
      }); // Filter out invalid entries
      
      console.log('Converted and filtered PO data:', poData); // Debug log
      
      if (poData.length === 0) {
        throw new Error('No valid records found in the file. Please check that your file contains the required columns: PO Number, VendorName, OrderedQty, ReceivedQty, PoAmount. Also ensure that each row has at least a PO Number and Vendor Name.');
      }
      
      // Add all parsed data to store
      let addedCount = 0;
      poData.forEach((po, index) => {
        console.log(`Adding PO ${index}:`, po); // Debug log
        try {
          if (type === 'pos') {
            addPO(po);
          } else {
            addOpenPO(po);
          }
          addedCount++;
        } catch (error) {
          console.error(`Error adding PO ${index}:`, error);
        }
      });

      const successMessage = `Successfully uploaded ${addedCount} records!`;
      console.log(successMessage); // Debug log
      if (type === 'pos') {
        setUploadStatus({
          type: 'success',
          message: successMessage
        });
        setFile(null);
        setPreviewData([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setOpenUploadStatus({
          type: 'success',
          message: successMessage
        });
        setOpenFile(null);
        setOpenPreviewData([]);
        if (openFileInputRef.current) {
          openFileInputRef.current.value = '';
        }
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'Error processing file. Please try again.';
      console.error('Upload error:', error); // Debug log
      if (type === 'pos') {
        setUploadStatus({
          type: 'error',
          message: errorMessage
        });
      } else {
        setOpenUploadStatus({
          type: 'error',
          message: errorMessage
        });
      }
    } finally {
      if (type === 'pos') {
        setIsUploading(false);
      } else {
        setIsOpenUploading(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, type: UploadType) => {
    e.preventDefault();
    console.log('Drop event:', e.dataTransfer.files); // Debug log
    const droppedFile = e.dataTransfer.files?.[0];
    console.log('Dropped file:', droppedFile); // Debug log
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      if (type === 'pos') {
        setFile(droppedFile);
        setUploadStatus(null);
      } else {
        setOpenFile(droppedFile);
        setOpenUploadStatus(null);
      }
      
      try {
        const parsedData = await parseFile(droppedFile);
        console.log('Parsed data from drop:', parsedData); // Debug log
        if (parsedData.length === 0) {
          throw new Error('No valid data found in the file. Please check that your file contains the required columns: PO Number, VendorName, OrderedQty, ReceivedQty, PoAmount');
        }
        if (type === 'pos') {
          setPreviewData(parsedData.slice(0, 5));
        } else {
          setOpenPreviewData(parsedData.slice(0, 5));
        }
      } catch (error) {
        const errorMessage = (error as Error).message || 'Error parsing file.';
        console.error('Drop parsing error:', error); // Debug log
        if (type === 'pos') {
          setUploadStatus({
            type: 'error',
            message: errorMessage
          });
          setPreviewData([]);
        } else {
          setOpenUploadStatus({
            type: 'error',
            message: errorMessage
          });
          setOpenPreviewData([]);
        }
      }
    } else {
      const errorMessage = 'Please upload a valid CSV or Excel file.';
      console.log('Invalid file type dropped'); // Debug log
      if (type === 'pos') {
        setUploadStatus({
          type: 'error',
          message: errorMessage
        });
      } else {
        setOpenUploadStatus({
          type: 'error',
          message: errorMessage
        });
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Data</h1>
        <p className="text-muted-foreground">Upload CSV or Excel files for POs and Open POs</p>
      </div>

      {/* Sample Data Download Buttons */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Download Sample Files</h3>
          <p className="text-sm text-muted-foreground">Use these templates for uploading your data</p>
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          <Button 
            onClick={() => {
              const csvContent = `PO Number,VendorName,OrderedQty,ReceivedQty,PoAmount\nPO-001,Sample Vendor A,100,95,1500.00\nPO-002,Sample Vendor B,200,200,3200.00\nPO-003,Sample Vendor C,50,45,750.50`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', 'sample-regular-pos.csv');
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            variant="outline"
          >
            <IconFileSpreadsheet className="mr-2 h-4 w-4" />
            Sample Regular POs CSV
          </Button>
          <Button 
            onClick={() => {
              const csvContent = `PO Number,VendorName,OrderedQty,ReceivedQty,PoAmount\nOPEN-001,Open Vendor A,150,120,2200.00\nOPEN-002,Open Vendor B,300,250,4800.00\nOPEN-003,Open Vendor C,75,60,1100.25`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', 'sample-open-pos.csv');
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            variant="outline"
          >
            <IconFileSpreadsheet className="mr-2 h-4 w-4" />
            Sample Open POs CSV
          </Button>
        </div>
      </div>

      {/* Test Data Button - for debugging */}
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => {
            addPO({
              poNumber: "TEST-001",
              vendor: "Test Vendor",
              orderedQty: 100,
              receivedQty: 95,
              poAmount: 1500.00
            });
          }}
        >
          Add Test PO
        </Button>
        <Button 
          onClick={() => {
            addOpenPO({
              poNumber: "OPEN-001",
              vendor: "Open Vendor",
              orderedQty: 200,
              receivedQty: 150,
              poAmount: 3200.00
            });
          }}
        >
          Add Test Open PO
        </Button>
        <Button 
          onClick={() => {
            localStorage.removeItem("erp-data-storage");
            window.location.reload();
          }}
          variant="destructive"
        >
          Clear All Data
        </Button>
        <Button 
          onClick={() => {
            const storedData = localStorage.getItem("erp-data-storage");
            console.log("Stored data:", storedData);
            if (storedData) {
              try {
                const parsed = JSON.parse(storedData);
                console.log("Parsed stored data:", parsed);
              } catch (e) {
                console.error("Error parsing stored data:", e);
              }
            } else {
              console.log("No stored data found");
            }
          }}
          variant="outline"
        >
          Check Stored Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regular POs Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File POs</CardTitle>
            <CardDescription>Upload files with columns: PO Number, VendorName, OrderedQty, ReceivedQty, PoAmount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'pos')}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconFileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <p className="font-medium">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground mt-2">or</p>
                <Button variant="outline" className="mt-2">
                  <IconUpload className="mr-2 h-4 w-4" />
                  Select File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: CSV, XLSX, XLS
              </p>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => handleFileChange(e, 'pos')}
              />
            </div>

            {file && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <IconFileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>

                {previewData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                    <div className="border rounded-lg max-h-60 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>PO Number</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Ordered</TableHead>
                            <TableHead>Received</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{row["PO Number"]}</TableCell>
                              <TableCell>{row["VendorName"]}</TableCell>
                              <TableCell>{row["OrderedQty"]}</TableCell>
                              <TableCell>{row["ReceivedQty"]}</TableCell>
                              <TableCell>{row["PoAmount"]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => handleUpload('pos')} 
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <IconUpload className="mr-2 h-4 w-4" />
                      Upload Data
                    </>
                  )}
                </Button>
              </div>
            )}

            {uploadStatus && (
              <div className={`rounded-lg p-4 ${uploadStatus.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                {uploadStatus.type === 'error' ? (
                  <IconAlertCircle className="h-4 w-4 inline mr-2" />
                ) : null}
                <span>
                  {uploadStatus.message}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Open POs Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload File Open POs</CardTitle>
            <CardDescription>Upload files with columns: PO Number, VendorName, OrderedQty, ReceivedQty, PoAmount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'openpos')}
              onClick={() => openFileInputRef.current?.click()}
            >
              <IconFileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4">
                <p className="font-medium">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground mt-2">or</p>
                <Button variant="outline" className="mt-2">
                  <IconUpload className="mr-2 h-4 w-4" />
                  Select File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: CSV, XLSX, XLS
              </p>
              <Input
                type="file"
                ref={openFileInputRef}
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => handleFileChange(e, 'openpos')}
              />
            </div>

            {openFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <IconFileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{openFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(openFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>

                {openPreviewData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                    <div className="border rounded-lg max-h-60 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>PO Number</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Ordered</TableHead>
                            <TableHead>Received</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {openPreviewData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{row["PO Number"]}</TableCell>
                              <TableCell>{row["VendorName"]}</TableCell>
                              <TableCell>{row["OrderedQty"]}</TableCell>
                              <TableCell>{row["ReceivedQty"]}</TableCell>
                              <TableCell>{row["PoAmount"]}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => handleUpload('openpos')} 
                  disabled={isOpenUploading}
                  className="w-full"
                >
                  {isOpenUploading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <IconUpload className="mr-2 h-4 w-4" />
                      Upload Data
                    </>
                  )}
                </Button>
              </div>
            )}

            {openUploadStatus && (
              <div className={`rounded-lg p-4 ${openUploadStatus.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                {openUploadStatus.type === 'error' ? (
                  <IconAlertCircle className="h-4 w-4 inline mr-2" />
                ) : null}
                <span>
                  {openUploadStatus.message}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Data Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Data</CardTitle>
          <CardDescription>Existing purchase orders in storage</CardDescription>
        </CardHeader>
        <CardContent>
          {pos.length > 0 || openpos.length > 0 ? (
            <div className="space-y-6">
              {pos.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Regular POs ({pos.length})</h3>
                  <div className="border rounded-lg max-h-60 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PO Number</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Ordered</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pos.map((po, index) => (
                          <TableRow key={`${po.poNumber}-${index}`}>
                            <TableCell className="font-medium">{po.poNumber}</TableCell>
                            <TableCell>{po.vendor}</TableCell>
                            <TableCell>{po.orderedQty}</TableCell>
                            <TableCell>{po.receivedQty}</TableCell>
                            <TableCell>${po.poAmount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {openpos.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Open POs ({openpos.length})</h3>
                  <div className="border rounded-lg max-h-60 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PO Number</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Ordered</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {openpos.map((po, index) => (
                          <TableRow key={`${po.poNumber}-${index}`}>
                            <TableCell className="font-medium">{po.poNumber}</TableCell>
                            <TableCell>{po.vendor}</TableCell>
                            <TableCell>{po.orderedQty}</TableCell>
                            <TableCell>{po.receivedQty}</TableCell>
                            <TableCell>${po.poAmount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <IconFileSpreadsheet className="mx-auto h-12 w-12" />
              <p className="mt-2">No data uploaded yet</p>
              <p className="text-sm">Upload files to see data here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;