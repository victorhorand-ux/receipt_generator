import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register "Cool Fonts" (Roboto from a public CDN)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 }
  ]
});

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Roboto', // Using the newly registered font
    color: '#333333',
  },
  // Add this new style for the number column
  colNum: { flex: 0.5, textAlign: 'center' }, 
  
  // Update colDesc from flex: 4 to flex: 3.5 to make room
  colDesc: { flex: 3.5 }, 
  
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },

  header: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 80,
    height: 150,
    objectFit: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005bb5',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  receiptMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#888888',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 2, textAlign: 'right' },
  colTotal: { flex: 2, textAlign: 'right' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
    paddingTop: 5,
  },
  summaryLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
    color: '#666666',
  },
  summaryValue: {
    width: 80,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#888888',
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
    lineHeight: 1.5,
  }
});

export default function ReceiptPDF({ customer, items, deliveryFee, subtotal, total }) {
  const receiptNumber = `REC-${new Date().getTime().toString().slice(-6)}`;
  const now = new Date();
  const date = new Date().toLocaleDateString('en-GB');
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header with Logo and Contacts */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Make sure logo.png is in your /public folder */}
            <Image style={styles.logo} src="/logo.png" />
            <View>
              <Text style={styles.title}>KigaliSwimShop</Text>
              <Text style={styles.contactInfo}>www.kigaliswimshop.online</Text>
              <Text style={styles.contactInfo}>Email: director@kigaliswimshop.online</Text>
              <Text style={styles.contactInfo}>Phone: +250 784 154 697</Text>
              <Text style={styles.contactInfo}>Kigali, Rwanda</Text>
            </View>
          </View>
          <View style={styles.receiptMeta}>
            <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>RECEIPT</Text>
            <Text style={styles.contactInfo}>No: {receiptNumber}</Text>
            <Text style={styles.contactInfo}>Date: {date}</Text>
            <Text style={styles.contactInfo}>Time: {time}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billed To</Text>
          <Text style={{ fontWeight: 'bold' }}>Customer name: {customer.name || 'Walk-in Customer'}</Text>
          {customer.phone ? <Text>Phone: {customer.phone}</Text> : null}
          {customer.address ? <Text>Address: {customer.address}</Text> : null}
        </View>

{/* Items Table */}
        <View style={styles.section}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colNum}>No</Text>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Unit Price</Text>
            <Text style={styles.colTotal}>Amount</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, index) => (
            <View key={item.id || index} style={styles.tableRow}>
              {/* index + 1 generates 1, 2, 3, etc. */}
              <Text style={styles.colNum}>{index + 1}</Text>
              <Text style={styles.colDesc}>{item.description || 'Item'}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colPrice}>{Number(item.price).toLocaleString()}</Text>
              <Text style={styles.colTotal}>{(item.qty * item.price).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Totals Summary */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString()} RWF</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee:</Text>
            <Text style={styles.summaryValue}>{Number(deliveryFee || 0).toLocaleString()} RWF</Text>
          </View>

          <View style={[styles.summaryRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#000000' }]}>
            <Text style={[styles.summaryLabel, styles.grandTotal]}>Total:</Text>
            <Text style={[styles.summaryValue, styles.grandTotal]}>{total.toLocaleString()} RWF</Text>
          </View>
        </View>

        {/* Appreciating & Closing Footer */}
        <View style={styles.footer}>
          <Text style={{ fontWeight: 'bold', color: '#333', marginBottom: 4 }}>Thank you for choosing KigaliSwimShop for your aquatic adventures!</Text>
          <Text>We appreciate your business and hope you enjoy your new gear.</Text>
        </View>

      </Page>
    </Document>
  );
}