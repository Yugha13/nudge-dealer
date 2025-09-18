import { useState, useRef } from "react";
import { useDataStore } from "@/store/useDataStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconUpload, IconFileSpreadsheet, IconAlertCircle } from "@tabler/icons-react";
import * as XLSX from "xlsx";

type PreviewData = {
  "Key": string;
  "SKU ID": string;
  "Product Name": string;
  "MRP": string;
  "Category": string;
  "Cases": string;
  "Merchants": string;
  "Landing Rate": string;
};

type UploadStatus = {
  type: 'success' | 'error';
  message: string;
};

const LandingRate = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { landingRates, addLandingRate } = useDataStore();

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
            
            const parseCSVLine = (line: string): string[] => {
              const result: string[] = [];
              let current = '';
              let inQuotes = false;
              
              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                  if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i++;
                  } else {
                    inQuotes = !inQuotes;
                  }
                } else if (char === ',' && !inQuotes) {
                  result.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              
              result.push(current.trim());
              return result;
            };
            
            const headers = parseCSVLine(lines[0]);
            const normalizedHeaders = headers.map(header => 
              header.trim().toLowerCase().replace(/\s+/g, '')
            );
            
            const keyIndex = normalizedHeaders.findIndex(h => h === 'key');
            const skuIdIndex = normalizedHeaders.findIndex(h => h === 'skuid' || h.includes('sku'));
            const productNameIndex = normalizedHeaders.findIndex(h => h === 'productname' || h.includes('product'));
            const mrpIndex = normalizedHeaders.findIndex(h => h === 'mrp');
            const categoryIndex = normalizedHeaders.findIndex(h => h === 'category');
            const casesIndex = normalizedHeaders.findIndex(h => h === 'cases');
            const merchantsIndex = normalizedHeaders.findIndex(h => h === 'merchants');
            const landingRateIndex = normalizedHeaders.findIndex(h => h === 'landingrate' || h.includes('landing'));
            
            for (let i = 1; i < lines.length; i++) {
              const values = parseCSVLine(lines[i]);
              
              if (values.length > 0 && values.some(v => v.trim() !== '')) {
                const mappedObj: PreviewData = {
                  "Key": keyIndex !== -1 && values[keyIndex] ? values[keyIndex].trim() : '',
                  "SKU ID": skuIdIndex !== -1 && values[skuIdIndex] ? values[skuIdIndex].trim() : '',
                  "Product Name": productNameIndex !== -1 && values[productNameIndex] ? values[productNameIndex].trim() : '',
                  "MRP": mrpIndex !== -1 && values[mrpIndex] ? values[mrpIndex].trim() : '',
                  "Category": categoryIndex !== -1 && values[categoryIndex] ? values[categoryIndex].trim() : '',
                  "Cases": casesIndex !== -1 && values[casesIndex] ? values[casesIndex].trim() : '',
                  "Merchants": merchantsIndex !== -1 && values[merchantsIndex] ? values[merchantsIndex].trim() : '',
                  "Landing Rate": landingRateIndex !== -1 && values[landingRateIndex] ? values[landingRateIndex].trim() : '',
                };
                
                const hasRequiredFields = mappedObj["Key"] && mappedObj["SKU ID"] && 
                                        mappedObj["Key"].trim() !== '' && mappedObj["SKU ID"].trim() !== '';
                
                if (hasRequiredFields) {
                  jsonData.push(mappedObj);
                }
              }
            }
          } else {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const sheetData: any[] = XLSX.utils.sheet_to_json(worksheet);
            
            jsonData = sheetData.map(row => {
              const keys = Object.keys(row);
              const normalizedKeys = keys.map(key => key.toLowerCase().replace(/\s+/g, ''));
              
              const keyKey = keys.find((_, index) => normalizedKeys[index] === 'key');
              const skuIdKey = keys.find((_, index) => normalizedKeys[index] === 'skuid' || normalizedKeys[index].includes('sku'));
              const productNameKey = keys.find((_, index) => normalizedKeys[index] === 'productname' || normalizedKeys[index].includes('product'));
              const mrpKey = keys.find((_, index) => normalizedKeys[index] === 'mrp');
              const categoryKey = keys.find((_, index) => normalizedKeys[index] === 'category');
              const casesKey = keys.find((_, index) => normalizedKeys[index] === 'cases');
              const merchantsKey = keys.find((_, index) => normalizedKeys[index] === 'merchants');
              const landingRateKey = keys.find((_, index) => normalizedKeys[index] === 'landingrate' || normalizedKeys[index].includes('landing'));
              
              return {
                "Key": String(row[keyKey] || ''),
                "SKU ID": String(row[skuIdKey] || ''),
                "Product Name": String(row[productNameKey] || ''),
                "MRP": String(row[mrpKey] || ''),
                "Category": String(row[categoryKey] || ''),
                "Cases": String(row[casesKey] || ''),
                "Merchants": String(row[merchantsKey] || ''),
                "Landing Rate": String(row[landingRateKey] || ''),
              };
            }).filter(row => {
              return row["Key"] && row["SKU ID"] && 
                     row["Key"].trim() !== '' && row["SKU ID"].trim() !== '';
            });
          }
          
          resolve(jsonData);
        } catch (error) {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
      
      try {
        const parsedData = await parseFile(selectedFile);
        if (parsedData.length === 0) {
          throw new Error('No valid data found in the file.');
        }
        setPreviewData(parsedData.slice(0, 5));
      } catch (error) {
        setUploadStatus({
          type: 'error',
          message: (error as Error).message || 'Error parsing file.'
        });
        setPreviewData([]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const parsedData = await parseFile(file);
      
      const landingRateData = parsedData.map(row => ({
        key: row["Key"]?.toString().trim() || '',
        skuId: row["SKU ID"]?.toString().trim() || '',
        productName: row["Product Name"]?.toString().trim() || '',
        mrp: parseFloat(row["MRP"]?.toString() || '0'),
        category: row["Category"]?.toString().trim() || '',
        cases: parseInt(row["Cases"]?.toString() || '0'),
        merchants: parseInt(row["Merchants"]?.toString() || '0'),
        landingRate: parseFloat(row["Landing Rate"]?.toString() || '0'),
      })).filter(rate => rate.key && rate.skuId);
      
      if (landingRateData.length === 0) {
        throw new Error('No valid records found in the file.');
      }
      
      let addedCount = 0;
      landingRateData.forEach(rate => {
        try {
          addLandingRate(rate);
          addedCount++;
        } catch (error) {
          console.error('Error adding landing rate:', error);
        }
      });

      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${addedCount} landing rates!`
      });
      setFile(null);
      setPreviewData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: (error as Error).message || 'Error processing file.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Landing Rate Upload</h1>
        <p className="text-muted-foreground">Upload CSV or Excel files for Landing Rates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Landing Rate File</CardTitle>
          <CardDescription>Upload files with columns: Key, SKU ID, Product Name, MRP, Category, Cases, Merchants, Landing Rate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary"
               onClick={() => fileInputRef.current?.click()}>
            <IconFileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <p className="font-medium">Select your landing rate file</p>
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
              onChange={handleFileChange}
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
                          <TableHead>Key</TableHead>
                          <TableHead>SKU ID</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>MRP</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Cases</TableHead>
                          <TableHead>Landing Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{row["Key"]}</TableCell>
                            <TableCell>{row["SKU ID"]}</TableCell>
                            <TableCell>{row["Product Name"]}</TableCell>
                            <TableCell>₹{row["MRP"]}</TableCell>
                            <TableCell>{row["Category"]}</TableCell>
                            <TableCell>{row["Cases"]}</TableCell>
                            <TableCell>₹{row["Landing Rate"]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <Button onClick={handleUpload} disabled={isUploading} className="w-full">
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
              <span>{uploadStatus.message}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Data */}
      <Card>
        <CardHeader>
          <CardTitle>Current Landing Rates ({landingRates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {landingRates.length > 0 ? (
            <div className="border rounded-lg max-h-60 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>SKU ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead>Landing Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {landingRates.map((rate, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rate.key}</TableCell>
                      <TableCell>{rate.skuId}</TableCell>
                      <TableCell>{rate.productName}</TableCell>
                      <TableCell>₹{rate.mrp.toFixed(2)}</TableCell>
                      <TableCell>{rate.category}</TableCell>
                      <TableCell>{rate.cases}</TableCell>
                      <TableCell>₹{rate.landingRate.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <IconFileSpreadsheet className="mx-auto h-12 w-12" />
              <p className="mt-2">No landing rates uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingRate;