import React, { useState, useEffect } from 'react';
import { X, Calendar, Package, AlertCircle, User, FileText, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Alert, AlertDescription } from '../../ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

// Import your API function
import { getPreformProductionById } from '../../../services/api/stock';

export default function PreformDetails({ productionId, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailsData, setDetailsData] = useState(null);

  useEffect(() => {
    if (isOpen && productionId) {
      fetchProductionDetails();
    }
  }, [isOpen, productionId]);

  const fetchProductionDetails = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await getPreformProductionById(productionId);
    
    if (response.status) {
      // Sort records by createdAt in descending order (newest first)
      const sortedResponse = {
        ...response,
        data: response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
      };
      setDetailsData(sortedResponse);
    } else {
      setError('Failed to load production details');
    }
  } catch (err) {
    setError(err.message || 'Failed to fetch production details');
  } finally {
    setLoading(false);
  }
};  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClose = () => {
    setDetailsData(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Preform Production Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about preform production records
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && detailsData && (
          <div className="space-y-6">
            {/* Summary Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Production Summary</CardTitle>
                <CardDescription>
                  Overview of all production records for this preform type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Preform Type</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {detailsData.preform.preformType}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Total Produced</p>
                    <p className="text-2xl font-bold text-green-700">
                      {detailsData.preform.totalProduced.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Total Wastage</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {detailsData.preform.totalWastage}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <Badge variant="outline" className="text-sm">
                    {detailsData.count} Production Record{detailsData.count !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Individual Production Records */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Production Records
              </h3>
              
              {detailsData.data.map((record, index) => (
                <Card key={record._id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          Record #{index + 1}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(record.productionDate)}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ID: {record._id.slice(-6)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Production Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Quantity Produced</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {record.quantityProduced}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Reusable Wastage</p>
                        <p className="text-lg font-semibold text-yellow-600">
                          {record.wastageType1}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Scrap Wastage</p>
                        <p className="text-lg font-semibold text-red-600">
                          {record.wastageType2}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Wastage</p>
                        <p className="text-lg font-semibold text-orange-600">
                          {record.totalWastage}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Raw Materials Used */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Raw Materials Used
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material Name</TableHead>
                            <TableHead>Item Code</TableHead>
                            <TableHead className="text-right">Quantity Used</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {record.rawMaterials.map((material) => (
                            <TableRow key={material._id}>
                              <TableCell className="font-medium">
                                {material.material.itemName}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {material.material.itemCode}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {material.quantityUsed}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {record.remarks && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Remarks</p>
                            <p className="text-sm text-gray-700">{record.remarks}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Recorded By</p>
                          <p className="text-sm text-gray-700">
                            {record.recordedBy.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Created At</p>
                          <p className="text-sm text-gray-700">
                            {formatDate(record.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}