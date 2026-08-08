import { useState } from 'react';
import { PDFViewer, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import ReceiptPDF from './ReceiptPDF';

export default function App() {
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [items, setItems] = useState([
    { id: Date.now(), description: '', qty: '', price: '' }
  ]);

  const [deliveryFee, setDeliveryFee] = useState('');

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numbersOnly = value.replace(/\D/g, '');
      setCustomer({ ...customer, [name]: numbersOnly });
    } else {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const parsedValue = value === '' ? '' : value;
        return { ...item, [field]: parsedValue };
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', qty: '', price: '' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.price) || 0)), 0);
  const total = subtotal + (Number(deliveryFee) || 0);

  const pdfProps = { customer, items, deliveryFee, subtotal, total };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KigaliSwimShop Receipts</h1>
          <p className="text-gray-500 mt-2 min-[1024px]:max-[1366px]:hidden">
            Enter the customer and product details below to generate a print-ready PDF receipt.
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Input Form */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Order Details</h2>
            
            {/* Customer Info */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Customer</h3>
              <input 
                type="text" name="name" placeholder="Full Name" 
                value={customer.name} onChange={handleCustomerChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" name="phone" placeholder="Phone Number" 
                  value={customer.phone} onChange={handleCustomerChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <input 
                  type="text" name="address" placeholder="Delivery Address" 
                  value={customer.address} onChange={handleCustomerChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider flex justify-between items-center">
                <span>Items</span>
              </h3>
              
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-2 md:items-center bg-gray-50 md:bg-transparent p-3 md:p-0 rounded border border-gray-200 md:border-none">
                  
                  {/* Mobile Label for the item number */}
                  <div className="flex justify-between items-center md:hidden mb-1">
                    <span className="text-xs font-bold text-gray-500">Item {index + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-red-500 font-bold px-2 hover:text-red-700">
                        &times;
                      </button>
                    )}
                  </div>

                  <input 
                    type="text" placeholder="Item description" 
                    value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  
                  {/* Container for Qty and Price on mobile */}
                  <div className="flex gap-2">
                    <input 
                      type="number" placeholder="Qty" min="1"
                      value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                      className="w-1/3 md:w-20 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <input 
                      type="number" placeholder="Price" min="0"
                      value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                      className="w-2/3 md:w-28 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Desktop Remove Button */}
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="hidden md:block text-red-500 font-bold px-2 hover:text-red-700">
                      &times;
                    </button>
                  )}
                </div>
              ))}
              
              <button onClick={addItem} className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block">
                + Add another item
              </button>
            </div>

            {/* Delivery & Totals Overview */}
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-gray-700">Delivery Fee (RWF)</label>
                <input 
                  type="number" min="0" placeholder="0"
                  value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-right"
                />
              </div>
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>{total.toLocaleString()} RWF</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PDF Preview & Download Action */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold">Receipt Output</h2>
              
              <PDFDownloadLink 
                document={<ReceiptPDF {...pdfProps} />} 
                fileName={`KigaliSwimShop_Receipt_${customer.name ? customer.name.replace(/\s+/g, '_') : 'Walk_in'}.pdf`}
                className="bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
              >
                {({ loading }) => (loading ? 'Preparing Document...' : 'Download PDF')}
              </PDFDownloadLink>
            </div>
            
            {/* Desktop Preview */}
            <div className="hidden md:flex flex-1 bg-gray-100 rounded border border-gray-200 overflow-hidden min-h-[600px]">
              <PDFViewer width="100%" height="100%" className="border-none">
                <ReceiptPDF {...pdfProps} />
              </PDFViewer>
            </div>

            {/* Mobile Fallback: Open generated blob in a new tab */}
            <div className="md:hidden flex-1 flex flex-col items-center justify-center bg-blue-50 rounded border border-blue-100 p-6 min-h-[150px] gap-4">
              <p className="text-sm text-blue-800 text-center">
                Inline preview disabled on mobile.
              </p>
              
              <BlobProvider document={<ReceiptPDF {...pdfProps} />}>
                {({ url, loading, error }) => {
                  if (loading) return <span className="text-blue-600 font-medium">Generating preview...</span>;
                  if (error) return <span>Error generating document.</span>;
                  return (
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded text-sm font-bold hover:bg-blue-50 transition-colors w-full text-center"
                    >
                      Preview Receipt
                    </a>
                  );
                }}
              </BlobProvider>
            </div>

            <p className="mt-6 text-xs text-gray-400 text-left sm:text-center">
              Disclaimer: Please review customer details carefully before printing. Generated PDFs are for documentation and proof of purchase only.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}