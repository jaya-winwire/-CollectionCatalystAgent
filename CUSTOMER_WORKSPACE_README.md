# Collection Catalyst Agent - Customer Workspace

## What's New

### 1. Customer Collection Workspace (`/customer/:customerId`)
A comprehensive, demo-ready screen for managing individual customer collections with AI assistance.

#### Key Features:

**Header Section:**
- Customer name and company information
- Key metrics dashboard: Outstanding Amount, Invoices, Days Overdue, Risk Score, Priority, Collection Owner
- Quick action buttons: Send Email, Call Customer

**Left Panel (2/3 width):**
- **Customer Information Card**: Contact details, credit limit, payment history
- **Tabbed Interface**:
  - Outstanding Invoices: Complete invoice list with amounts and status
  - Payment History: Historical payment records
  - Communications: Email and call history
  - Email Generator: AI-powered reminder email creation

- **Recommended Payment Plan Card**: 
  - AI-optimized 3-month installment plan
  - Success probability indicator (91%)
  - Accept/Modify/Reject actions

- **Dataverse Synchronization Card**:
  - Last sync status
  - Updated by information
  - Reminder and approval status

**Right Panel (1/3 width):**
- **AI Collection Assistant** (ChatGPT-style interface):
  - 5 suggested prompts for quick access
  - Interactive chat with AI responses
  - Confidence scores and supporting factors
  - Real-time thinking animation

- **Activity Timeline**:
  - Dynamic timeline updates
  - Status icons and timestamps
  - Real-time workflow tracking

#### Demo Workflow:
1. Click "Take Action" on any high-risk customer card from dashboard
2. Ask AI: "Why is this customer high risk?"
3. AI provides detailed analysis with confidence score
4. Click "Generate reminder email" suggestion
5. Review AI-generated email in the Email Generator tab
6. Click "Approve & Send"
7. Watch the approval workflow:
   - Manager Approval → Reminder Email Sent → Outlook Notification → Dataverse Updated
8. Timeline updates in real-time with success notifications

### 2. Routing & Navigation
- Implemented React Router for seamless navigation
- Dashboard links directly to customer workspaces
- All menu items have placeholder pages
- "View Details" buttons link to customer workspace

### 3. Mock Data
- Two fully populated customers: Acme Corporation & TechVision Industries
- Realistic invoices, payment history, and communications
- AI-generated insights and recommendations
- Complete customer profiles with contact information

### 4. Placeholder Pages
Created placeholder pages for:
- Collections
- Customers
- Invoices
- AI Assistant
- Approvals
- Reports
- Settings

### 5. Animations & UX
- Framer Motion animations for:
  - Card hover effects
  - Page transitions
  - AI response animations
  - Timeline updates
  - Suggested prompt cards
- Toast notifications for success messages
- Loading states and skeletons
- Smooth transitions throughout

## Updated Files

1. **`src/main.tsx`**: Added React Router setup with all routes
2. **`src/app/App.tsx`**: Updated with navigation links to customer workspace
3. **`src/app/pages/CustomerWorkspace.tsx`**: New comprehensive customer workspace (1,050+ lines)
4. **`src/app/pages/PlaceholderPage.tsx`**: Reusable placeholder component

## Demo Flow (5 minutes)

1. **Dashboard Overview** (1 min)
   - Show KPIs and Dataverse integration
   - Highlight AI Risk Prioritization cards
   - Point out Collections Trend and Recent Activities

2. **Select Customer** (30 sec)
   - Click "Take Action" on Acme Corporation (Risk Score: 92)

3. **Customer Workspace** (2 min)
   - Review customer header with key metrics
   - Show customer information and outstanding invoices
   - Demonstrate payment history tab

4. **AI Assistant** (1 min)
   - Click "Why is this customer high risk?"
   - Show AI analysis with 94% confidence
   - Display supporting factors

5. **Email Generation & Workflow** (30 sec)
   - Click "Generate reminder email"
   - Switch to Email Generator tab
   - Review AI-generated email

6. **Approve & Send** (1 min)
   - Click "Approve & Send"
   - Watch activity timeline update in real-time:
     ✓ Manager Approved
     ✓ Reminder Email Sent
     ✓ Outlook Notification
     ✓ Dataverse Updated Successfully
   - Show success toasts

## Technical Stack

- **React 18.3.1** + TypeScript
- **React Router 7.13.0** for navigation
- **Framer Motion 12** for animations
- **Recharts** for data visualization
- **Shadcn/ui** components
- **Tailwind CSS** for styling
- **Sonner** for toast notifications
- **Lucide React** for icons

## Running the Application

```bash
npm run dev
```

Visit: http://localhost:5174/

## Customer IDs for Testing

- `CUST-1001`: Acme Corporation (High Risk - 92)
- `CUST-1002`: TechVision Industries (High Risk - 85)

Direct links:
- http://localhost:5174/customer/CUST-1001
- http://localhost:5174/customer/CUST-1002

## Key Design Decisions

1. **Color-coded sections**: Red (AI Risk), Green (Collections), Purple (Activities), Blue (Worklist)
2. **Consistent typography**: Maintained existing design system
3. **Real-time updates**: Timeline and notifications provide immediate feedback
4. **AI-first approach**: Assistant is prominently featured and always accessible
5. **Demo-optimized**: 5-minute complete workflow demonstration
6. **Enterprise polish**: Professional styling suitable for executive demos

## Next Steps (Not Implemented)

- Backend API integration
- Real Dataverse connectivity
- Actual email sending via Microsoft Graph
- User authentication
- Multi-tenant support
- Advanced filtering and search
- Export functionality
- Real-time notifications via SignalR

---

**Note**: This is a demo application with mock data. No actual emails are sent, and no backend services are connected.
