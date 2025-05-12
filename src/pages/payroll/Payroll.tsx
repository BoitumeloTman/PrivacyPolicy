import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Download, Eye, Calendar } from 'lucide-react';
import { jsPDF } from 'jspdf'; // ✅

const mockPayslips = [
  { id: '1', month: 'May', year: 2025, amount: 2500, status: 'paid', date: '2025-05-28' },
  { id: '2', month: 'April', year: 2025, amount: 2500, status: 'paid', date: '2025-04-28' },
  { id: '3', month: 'March', year: 2025, amount: 2300, status: 'paid', date: '2025-03-28' },
  { id: '4', month: 'February', year: 2025, amount: 2300, status: 'paid', date: '2025-02-28' },
];

export const Payroll: React.FC = () => {
  const [year, setYear] = useState('2025');
  const currentYear = new Date().getFullYear();
  
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const yearValue = (currentYear - i).toString();
    return { value: yearValue, label: yearValue };
  });
  
  const filteredPayslips = mockPayslips.filter(payslip => payslip.year.toString() === year);

  const formatCurrency = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA')}`;
  };

  const handleDownload = (payslip: typeof mockPayslips[number]) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Payslip', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Month: ${payslip.month} ${payslip.year}`, 20, 40);
    doc.text(`Amount: ${formatCurrency(payslip.amount)}`, 20, 50);  // ✅ RANDS
    doc.text(`Status: ${payslip.status}`, 20, 60);
    doc.text(`Date Issued: ${payslip.date}`, 20, 70);

    doc.save(`Payslip-${payslip.month}-${payslip.year}.pdf`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Payroll</h1>
          <p className="text-gray-400">View and download your payslips</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-48">
          <Select
            options={yearOptions}
            value={year}
            onChange={setYear}
            label="Select Year"
            fullWidth
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payslips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Period</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Amount</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayslips.map((payslip) => (
                  <tr key={payslip.id} className="border-b border-zinc-800">
                    <td className="py-4 px-4 text-white">
                      <div className="flex items-center">
                        <span className="h-10 w-10 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center mr-3">
                          <Calendar size={18} />
                        </span>
                        {payslip.month} {payslip.year}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      {formatCurrency(payslip.amount)} {/* ✅ Updated */}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        payslip.status === 'paid' ? 'bg-emerald-500/20 text-emerald-500' :
                        payslip.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {payslip.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400">
                      {payslip.date}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" leftIcon={<Eye size={16} />}>
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          leftIcon={<Download size={16} />} 
                          onClick={() => handleDownload(payslip)}
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredPayslips.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No payslips found for the selected year
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
