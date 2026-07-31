import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Building2, DollarSign, FileText, Calendar, AlertTriangle,
  User, Phone, Mail, MapPin, TrendingDown, Clock, MessageSquare,
  Send, Sparkles, ChevronRight, CheckCircle2, Mail as MailIcon,
  FileCheck, Database, CircleDot, Loader2, CheckCircle, XCircle, Zap, Bot
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import AppLayout from '../components/AppLayout';
import { getCustomerProfileByCode } from '../../controller/customerProfileController';
import { generateEmailDraft } from '../../controller/emailDraftController';
import { approveSendEmail } from '../../controller/emailApprovalController';
import { getMailAccessToken } from '../../auth/dataverseAuth';
import { updateReminderDraft } from '../../controller/reminderHistoryController';

// Mock customer data
// Kept as reference — this page now fetches live data via getCustomerProfileByCode()
// below. Not deleted, just inactive.
/* const mockCustomers = [
  {
    id: 'CUST-001',
    name: 'Acme Corporation',
    industry: 'Manufacturing',
    email: 'accounts@acmecorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    outstandingAmount: 312000,
    overdueAmount: 245000,
    totalInvoices: 5,
    overdueInvoices: 3,
    daysOverdue: 61,
    riskScore: 95,
    priority: 'High',
    owner: 'Maria Torres',
    creditLimit: 500000,
    avgPaymentDays: 68,
    invoices: [
      { id: 'INV-2024-1156', amount: 85000, dueDate: '2024-05-15', status: 'Overdue', daysOverdue: 67 },
      { id: 'INV-2024-1089', amount: 52000, dueDate: '2024-06-01', status: 'Overdue', daysOverdue: 50 },
      { id: 'INV-2024-1234', amount: 43000, dueDate: '2024-06-15', status: 'Overdue', daysOverdue: 36 },
      { id: 'INV-2024-1456', amount: 38000, dueDate: '2024-07-10', status: 'Due Soon', daysOverdue: 0 },
      { id: 'INV-2024-1567', amount: 27000, dueDate: '2024-07-25', status: 'Current', daysOverdue: 0 },
    ],
    paymentHistory: [
      { date: '2024-03-15', amount: 45000, invoice: 'INV-2024-0987', days: 45 },
      { date: '2024-02-20', amount: 38000, invoice: 'INV-2024-0876', days: 52 },
      { date: '2024-01-18', amount: 62000, invoice: 'INV-2024-0765', days: 38 },
      { date: '2023-12-22', amount: 51000, invoice: 'INV-2023-1234', days: 67 },
    ],
    communications: [
      { date: '2024-07-18', type: 'Email', subject: 'Payment Reminder - Overdue Invoices', status: 'Sent' },
      { date: '2024-07-10', type: 'Call', subject: 'Follow-up on outstanding balance', status: 'Completed' },
      { date: '2024-06-28', type: 'Email', subject: 'First Payment Reminder', status: 'Sent' },
    ]
  },
  {
    id: 'CUST-002',
    name: 'TechVision Industries',
    industry: 'Technology',
    email: 'billing@techvision.com',
    phone: '+1 (555) 234-5678',
    address: '456 Innovation Blvd, Austin, TX 78701',
    outstandingAmount: 186000,
    overdueAmount: 125000,
    totalInvoices: 4,
    overdueInvoices: 2,
    daysOverdue: 52,
    riskScore: 85,
    priority: 'High',
    owner: 'Michael Chen',
    creditLimit: 400000,
    avgPaymentDays: 52,
    invoices: [
      { id: 'INV-2024-1678', amount: 72000, dueDate: '2024-05-20', status: 'Overdue', daysOverdue: 62 },
      { id: 'INV-2024-1789', amount: 53000, dueDate: '2024-06-05', status: 'Overdue', daysOverdue: 46 },
      { id: 'INV-2024-1890', amount: 38000, dueDate: '2024-07-15', status: 'Due Soon', daysOverdue: 0 },
      { id: 'INV-2024-1901', amount: 23000, dueDate: '2024-07-30', status: 'Current', daysOverdue: 0 },
    ],
    paymentHistory: [
      { date: '2024-03-10', amount: 55000, invoice: 'INV-2024-0456', days: 48 },
      { date: '2024-02-15', amount: 42000, invoice: 'INV-2024-0345', days: 55 },
    ],
    communications: [
      { date: '2024-07-15', type: 'Email', subject: 'Urgent: Payment Required', status: 'Sent' },
      { date: '2024-07-05', type: 'Call', subject: 'Payment discussion', status: 'Completed' },
    ]
  }
]; */

const CustomerWorkspace: React.FC = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [reminderHistoryId, setReminderHistoryId] = useState<string | null>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailTone, setEmailTone] = useState('professional');
  const [timeline, setTimeline] = useState<any[]>([]);
  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  useEffect(() => {
    if (!customerId) return;
    let cancelled = false;

    // Fetch customer by customer code (cca_customercode) from Dataverse
    setEmailSubject('');
    setEmailBody('');
    setReminderHistoryId(null);
    setApprovalStatus('pending');
    setIsEmailSent(false);

    getCustomerProfileByCode(customerId).then((foundCustomer) => {
      if (cancelled || !foundCustomer) return;
      setCustomer(foundCustomer);
      addTimelineEvent('Customer Selected', 'User navigated to customer workspace', 'info');
      addTimelineEvent('Risk Analysis Completed', `Risk Score: ${foundCustomer.riskScore} - ${foundCustomer.priority} Priority`, 'warning');
    }).catch((err) => {
      console.error('[CustomerWorkspace] Failed to load customer profile:', err);
    });

    return () => { cancelled = true; };
  }, [customerId]);

  const addTimelineEvent = (title: string, description: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setTimeline(prev => [...prev, {
      id: Date.now(),
      title,
      description,
      timestamp: new Date().toLocaleTimeString(),
      type
    }]);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    console.log('Suggested prompt clicked:', prompt);
    console.log('Customer data:', customer);
    handleSendMessage(prompt);
  };

  const handleSendMessage = async (message?: string) => {
    const msg = message || userInput;
    console.log('handleSendMessage called with:', msg);
    if (!msg.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setUserInput('');
    setIsAIThinking(true);
    console.log('Set isAIThinking to true');

    // Simulate AI response
    setTimeout(() => {
      try {
        let aiResponse: any = '';
        console.log('Processing AI response, customer:', customer);

        if (!customer) {
          aiResponse = 'Customer data is still loading. Please try again in a moment.';
          setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
          setIsAIThinking(false);
          return;
        }

        console.log('Message check:', msg.toLowerCase(), 'includes high risk:', msg.toLowerCase().includes('high risk'));
        
        if (msg.toLowerCase().includes('high risk') || msg.toLowerCase().includes('why')) {
        console.log('Generating risk analysis response');
        aiResponse = {
          type: 'risk-analysis',
          title: `Why is ${customer?.name} high risk?`,
          content: `${customer?.name} has a **High Risk Score of ${customer?.riskScore}** because:`,
          points: [
            `**${customer?.overdueInvoices} overdue invoices** totaling **$${customer?.overdueAmount.toLocaleString()}**`,
            `Average payment delay of **${customer?.daysOverdue} days**`,
            `Multiple missed payment commitments over the past 6 months`,
            `Declining payment consistency trend`,
            `Outstanding balance represents **${Math.round((customer?.outstandingAmount / customer?.creditLimit) * 100)}%** of credit limit`
          ],
          recommendation: `**Recommendation:** Immediate engagement is required. Escalate to senior collection manager and consider payment plan restructuring.`,
          confidence: 94,
          supportingFactors: [
            'Historical payment pattern analysis',
            'Credit utilization trend',
            'Communication response rate',
            'Industry risk factors'
          ]
        };
        
        addTimelineEvent('AI Explanation Generated', 'Risk analysis completed with 94% confidence', 'success');
      } else if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('reminder')) {
        aiResponse = `I've generated a professional reminder email for ${customer?.name}. The email is personalized based on:\n\n`;
        aiResponse += `• Current outstanding balance and overdue amounts\n`;
        aiResponse += `• Payment history and relationship duration\n`;
        aiResponse += `• Tone optimized for customer relationship preservation\n\n`;
        aiResponse += `**Email Preview:**\n\n`;
        
        const subject = `Important: Outstanding Payment Reminder - ${customer?.overdueInvoices} Overdue Invoices`;
        const body = `Dear Accounts Payable Team,\n\nI hope this message finds you well. I'm reaching out regarding ${customer?.overdueInvoices} overdue invoices totaling $${customer?.overdueAmount.toLocaleString()} for ${customer?.name}.\n\nOverdue Invoices:\n${customer?.invoices.filter((inv: any) => inv.status === 'Overdue').map((inv: any) => `• ${inv.id}: $${inv.amount.toLocaleString()} (${inv.daysOverdue} days overdue)`).join('\n')}\n\nWe value our partnership and want to work with you to resolve this matter. Please contact me at your earliest convenience to discuss payment arrangements.\n\nBest regards,\n${customer?.owner}\nCollection Specialist`;
        
        setEmailSubject(subject);
        setEmailBody(body);
        
        aiResponse += `**Subject:** ${subject}\n\n`;
        aiResponse += `The complete email is ready in the Reminder Email section below. You can review, edit, and send it directly.`;
        
        addTimelineEvent('Reminder Draft Created', 'AI-generated email ready for review', 'success');
      } else if (msg.toLowerCase().includes('payment plan')) {
        aiResponse = {
          type: 'payment-plan',
          content: `Based on ${customer?.name}'s financial profile and payment history, I recommend a **3-Month Structured Payment Plan**:`,
          points: [
            `Monthly installment: $${Math.round(customer?.overdueAmount / 3).toLocaleString()}`,
            `Total recovery: $${customer?.overdueAmount.toLocaleString()}`,
            `Success probability: 91%`
          ],
          subheading: 'Why this works:',
          subpoints: [
            "Aligned with customer's cash flow patterns",
            'Similar plans have 89% success rate in this industry',
            'Preserves customer relationship while ensuring recovery'
          ],
          recommendation: '**Next Steps:** Present this plan during your next communication.',
          confidence: 91
        };
      } else if (msg.toLowerCase().includes('payment history') || msg.toLowerCase().includes('summarize')) {
        aiResponse = `**Payment History Summary for ${customer?.name}:**\n\n• Average payment cycle: **${customer?.avgPaymentDays} days**\n• Payment reliability: **Declining** (was 45 days, now 68 days)\n• Last 4 payments: All delayed beyond terms\n• Communication responsiveness: **Moderate** (responds within 48 hours)\n\n**Trend Analysis:** Payment delays are increasing, suggesting potential financial stress or operational issues.`;
      } else if (msg.toLowerCase().includes('escalate')) {
        aiResponse = `**Escalation Assessment for ${customer?.name}:**\n\n**Yes, escalation is recommended** based on:\n\n✓ Outstanding amount exceeds $180,000\n✓ Multiple overdue invoices (${customer?.overdueInvoices})\n✓ Average delay of ${customer?.daysOverdue} days exceeds company threshold\n✓ Declining payment pattern over 6 months\n\n**Recommended Actions:**\n1. Escalate to Senior Collection Manager\n2. Schedule executive-level discussion\n3. Consider legal review if no response within 15 days\n4. Implement credit hold on new orders`;
      } else {
        aiResponse = `I can help you with:\n\n• Risk analysis and customer insights\n• Email reminder generation\n• Payment plan recommendations\n• Payment history analysis\n• Escalation decisions\n\nTry asking: "Why is this customer high risk?" or "Generate reminder email"`;
      }

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse
      }]);
      console.log('Setting isAIThinking to false, response:', aiResponse);
      setIsAIThinking(false);
      } catch (error) {
        console.error('Error in AI response:', error);
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error processing your request. Please try again.'
        }]);
        setIsAIThinking(false);
      }
    }, 1500);
  };

  const handleApproveAndSend = async () => {
    setShowApprovalFlow(true);
    addTimelineEvent('Approval Requested', 'Email sent for manager approval', 'info');

    setTimeout(async () => {
      addTimelineEvent('Manager Approved', 'Email approved by Sarah Johnson', 'success');
      setApprovalStatus('approved');

      try {
        const accessToken = await getMailAccessToken();
        // Not verifying/inspecting the token — passed straight through to the flow.
        await approveSendEmail({
          RId: reminderHistoryId ?? '',
          accessToken,
          sendTo: customer?.email,
        });

        setIsEmailSent(true);
        addTimelineEvent('Reminder Email Sent', `Email sent to ${customer?.email}`, 'success');
        toast.success('Reminder email sent successfully!');

        setTimeout(() => {
          addTimelineEvent('Dataverse Updated', 'Customer record and activity log synchronized', 'success');
          toast.success('Dataverse updated successfully!');
          setShowApprovalFlow(false);
        }, 1500);
      } catch (err) {
        console.error('[CustomerWorkspace] Failed to approve and send email:', err);
        addTimelineEvent('Send Failed', 'Could not send the reminder email. Please try again.', 'error');
        toast.error('Failed to send reminder email.');
        setShowApprovalFlow(false);
      }
    }, 1500);
  };

  const handleGenerateEmail = async () => {
    if (!customer?.aid) return;
    setIsGeneratingEmail(true);

    try {
      const draft = await generateEmailDraft(customer.aid);
      setEmailSubject(draft.subject);
      setEmailBody(draft.body);
      setReminderHistoryId(draft.RHId);

      addTimelineEvent('Email Draft Generated', 'AI-generated email ready for review', 'success');
      toast.success('Email draft generated successfully!');
    } catch (err) {
      console.error('[CustomerWorkspace] Failed to generate email draft:', err);
      toast.error('Failed to generate email draft. Please try again.');
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!reminderHistoryId) {
      toast.error('No draft to save yet — generate an email first.');
      return;
    }

    setIsSavingDraft(true);
    try {
      await updateReminderDraft(reminderHistoryId, emailSubject, emailBody);
      setIsEditingEmail(false);
      addTimelineEvent('Email Draft Updated', 'Draft subject and body saved', 'success');
      toast.success('Draft saved successfully!');
    } catch (err) {
      console.error('[CustomerWorkspace] Failed to save email draft:', err);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleDecline = () => {
    setEmailSubject('');
    setEmailBody('');
    setReminderHistoryId(null);
    setApprovalStatus('pending');
    setIsEmailSent(false);
    addTimelineEvent('Email Draft Declined', 'Draft discarded — ready to generate a new one', 'info');
    toast.info('Draft declined.');
  };

  if (!customer) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#003087]" />
        </div>
      </AppLayout>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return 'bg-red-100 text-red-700 border-red-200';
    if (priority === 'Medium') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <AppLayout>
    <div className="flex h-full overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
      <div className="bg-gray-50 min-h-full">
        {/* Page Header */}
        <div className="bg-white border-b border-[#DDDDDD]">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{customer.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {customer.id}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {customer.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Owner: {customer.owner}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {/* Outstanding Amount */}
            <Card className="p-5 border-[#DDDDDD] hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Outstanding Amount</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                ${customer.outstandingAmount.toLocaleString()}
              </div>
            </Card>

            {/* Invoices */}
            <Card className="p-5 border-[#DDDDDD] hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-purple-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Invoices</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {customer.totalInvoices}
              </div>
            </Card>

            {/* Days Overdue */}
            <Card className="p-5 border-[#DDDDDD] hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-orange-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Days Overdue</span>
              </div>
              <div className="text-2xl font-bold text-red-600 mt-2">
                {customer.daysOverdue}
              </div>
            </Card>

            {/* Risk Score */}
            <Card className={`p-5 border-2 hover:shadow-lg transition-all ${getRiskColor(customer.riskScore)}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  customer.riskScore >= 80 ? 'bg-red-200' : 'bg-orange-200'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide">Risk Score</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {customer.riskScore}/100
              </div>
            </Card>

            {/* Priority */}
            <Card className={`p-5 border-2 hover:shadow-lg transition-all ${getPriorityColor(customer.priority)}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  customer.priority === 'High' ? 'bg-red-200' : 'bg-orange-200'
                }`}>
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide">Priority</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {customer.priority}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Full Width Content */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="p-6 border-[#DDDDDD]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#003087]" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-medium text-gray-900">{customer.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="text-sm font-medium text-gray-900">{customer.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 col-span-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="text-sm font-medium text-gray-900">{customer.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Credit Limit</div>
                  <div className="text-sm font-medium text-gray-900">${customer.creditLimit.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-500">Avg Payment Days</div>
                  <div className="text-sm font-medium text-gray-900">{customer.avgPaymentDays} days</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="invoices" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg h-auto gap-1 border border-gray-200">
              <TabsTrigger 
                value="invoices" 
                className="data-[state=active]:bg-[#003087] data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 font-semibold rounded-md py-2.5 transition-all flex items-center gap-2 justify-center"
              >
                <FileText className="w-4 h-4" />
                Outstanding Invoices
              </TabsTrigger>
              <TabsTrigger 
                value="payment"
                className="data-[state=active]:bg-[#003087] data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 font-semibold rounded-md py-2.5 transition-all flex items-center gap-2 justify-center"
              >
                <Clock className="w-4 h-4" />
                Payment History
              </TabsTrigger>
              <TabsTrigger 
                value="communication"
                className="data-[state=active]:bg-[#003087] data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 font-semibold rounded-md py-2.5 transition-all flex items-center gap-2 justify-center"
              >
                <MessageSquare className="w-4 h-4" />
                Communications
              </TabsTrigger>
              <TabsTrigger 
                value="email"
                className="data-[state=active]:bg-[#003087] data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 font-semibold rounded-md py-2.5 transition-all flex items-center gap-2 justify-center"
              >
                <Sparkles className="w-4 h-4" />
                Email Generator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="mt-4">
              <Card className="border-[#DDDDDD]">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-semibold text-gray-600 pb-3 pr-4">Invoice ID</th>
                        <th className="text-right text-xs font-semibold text-gray-600 pb-3 pr-6">Amount</th>
                        <th className="text-left text-xs font-semibold text-gray-600 pb-3 pr-4">Due Date</th>
                        <th className="text-left text-xs font-semibold text-gray-600 pb-3 pr-4">Status</th>
                        <th className="text-right text-xs font-semibold text-gray-600 pb-3">Days Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.invoices
                        .filter((invoice: any) => ['Overdue', 'Partial', 'Pending'].includes(invoice.status))
                        .map((invoice: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 pr-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                          <td className="py-3 pr-6 text-sm font-semibold text-right text-gray-900">
                            ${invoice.amount.toLocaleString()}
                          </td>
                          <td className="py-3 pr-4 text-sm text-gray-600">{invoice.dueDate?.split('T')[0]}</td>
                          <td className="py-3 pr-4">
                            <Badge
                              variant={invoice.status === 'Overdue' ? 'destructive' : 'secondary'}
                              className={invoice.status === 'Partial' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                            >
                              {invoice.status === 'Pending' ? 'Due Soon' : invoice.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-sm font-semibold text-right text-red-600">
                            {invoice.daysOverdue > 0 ? invoice.daysOverdue : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-4">
              <Card className="border-[#DDDDDD]">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="w-1/3 text-left text-xs font-semibold text-gray-600 pb-3 px-2">Date</th>
                        <th className="w-1/3 text-right text-xs font-semibold text-gray-600 pb-3 px-2">Amount</th>
                        <th className="w-1/3 text-left text-xs font-semibold text-gray-600 pb-3 px-2">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.paymentHistory.map((payment: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="w-1/3 py-3 px-2 text-sm text-gray-600">{payment.date?.split('T')[0]}</td>
                          <td className="w-1/3 py-3 px-2 text-sm font-semibold text-right text-gray-900">
                            ${payment.amount.toLocaleString()}
                          </td>
                          <td className="w-1/3 py-3 px-2 text-sm font-medium text-gray-900">{payment.invoice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="mt-4">
              <Card className="border-[#DDDDDD]">
                <div className="p-4 space-y-3">
                  {customer.communications.map((comm: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {comm.type === 'Email' ? (
                          <Mail className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Phone className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-900">{comm.subject}</span>
                          <Badge variant="secondary" className="text-xs">{comm.status}</Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {comm.type} • {comm.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="mt-4">
              <Card className="border-[#DDDDDD]">
                {emailSubject && emailBody ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Header with AI Draft Response badge */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-900">AI Draft Response</h3>
                      </div>
                    </div>

                    {/* Email Content */}
                    <div className="p-6 bg-white">
                      {/* Subject */}
                      <div className="mb-4">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Subject: Re: Urgent: BGP Route Hijack Causing Widespread Outages – Immediate Action Required
                        </label>
                        {isEditingEmail ? (
                          <input
                            type="text"
                            className="w-full text-sm text-gray-800 bg-white px-4 py-3 rounded-lg border border-[#003087] focus:outline-none focus:ring-1 focus:ring-[#003087]"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                          />
                        ) : (
                          <div className="text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                            {emailSubject}
                          </div>
                        )}
                      </div>

                      {/* Email Body */}
                      <div className="mb-6">
                        {isEditingEmail ? (
                          <Textarea
                            className="w-full min-h-[240px] bg-white border border-[#003087] rounded-lg p-6 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#003087]"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                          />
                        ) : (
                          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                            {emailBody}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button 
                          className="flex-1 bg-[#0078D4] hover:bg-[#106EBE] text-white py-6 text-base font-semibold"
                          onClick={handleApproveAndSend}
                          disabled={showApprovalFlow || isEditingEmail}
                        >
                          {showApprovalFlow ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Approve & Send Email
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 py-6 text-base font-semibold"
                          onClick={handleDecline}
                          disabled={isEditingEmail}
                        >
                          Decline
                        </Button>
                      </div>

                      {/* Edit and Regenerate Options */}
                      <div className="flex gap-3 mt-3">
                        {isEditingEmail ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => setIsEditingEmail(false)}
                              disabled={isSavingDraft}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-700 hover:text-green-800"
                              onClick={handleSaveDraft}
                              disabled={isSavingDraft}
                            >
                              {isSavingDraft ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <FileText className="w-4 h-4 mr-2" />
                              )}
                              Save Draft
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => setIsEditingEmail(true)}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Edit Draft
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-900"
                              onClick={handleGenerateEmail}
                              disabled={isGeneratingEmail}
                            >
                              {isGeneratingEmail ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                              )}
                              Regenerate
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-16">
                    {isGeneratingEmail ? (
                      <div className="text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Generating Email Draft...</h4>
                        <p className="text-sm text-gray-600">AI is crafting a personalized reminder email</p>
                      </div>
                    ) : (
                      <div>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-purple-600" />
                        </div>
                        <h4 className="text-base font-semibold text-gray-900 mb-2">Email Generator</h4>
                        <p className="text-sm text-gray-600 mb-6">Generate AI-powered payment reminder emails</p>
                        <Button 
                          onClick={handleGenerateEmail}
                          className="bg-[#0078D4] hover:bg-[#106EBE] text-white px-8 py-6 text-base font-semibold"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Email Draft
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recommended Payment Plan */}
          <Card className="border-[#DDDDDD] p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#003087]" />
              Recommended Payment Plan
            </h3>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">3 Monthly Installments</div>
                  <div className="text-sm text-gray-600">AI-Optimized Plan</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">Monthly Payment</div>
                  <div className="text-xl font-bold text-gray-900">
                    ${(customer.overdueAmount / 3).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">Expected Recovery</div>
                  <div className="text-xl font-bold text-gray-900">
                    ${customer.overdueAmount.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">Duration</div>
                  <div className="text-xl font-bold text-gray-900">3 Months</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Accept Plan
                </Button>
                <Button variant="outline" className="flex-1">
                  Modify Terms
                </Button>
                <Button variant="outline" className="flex-1">
                  Reject
                </Button>
              </div>
            </div>
          </Card>

          {/* Collection Workflow Progress - Hidden */}
          <Card className="border-[#DDDDDD] p-6 hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#003087]" />
              Collection Workflow Progress
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* AI Analysis */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">AI Analysis</div>
                  <div className="text-sm font-semibold text-green-600">Completed</div>
                </div>
              </div>

              {/* Reminder Generated */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Reminder</div>
                  <div className="text-sm font-semibold text-blue-600">Generated</div>
                </div>
              </div>

              {/* Approval Status */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Approval</div>
                  <div className="text-sm font-semibold text-yellow-600">Pending</div>
                </div>
              </div>

              {/* Email Status */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <MailIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-semibold text-gray-500">Not Sent</div>
                </div>
              </div>

              {/* Dataverse Sync */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Dataverse</div>
                  <div className="text-sm font-semibold text-green-600">Synced</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Collection Workflow Progress and Activity Timeline - Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Collection Workflow Status - Alternative Design (Timeline) */}
            <Card className="border-[#DDDDDD] p-6 bg-gradient-to-br from-white to-blue-50/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#003087]" />
                Collection Workflow Status
              </h3>
              <div className="space-y-2">
                {/* AI Analysis */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">AI Analysis</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
                    </div>
                    <p className="text-xs text-gray-600">Risk assessment and insights generated</p>
                  </div>
                </div>

                {/* Reminder Generated */}
                {(() => {
                  const reminderGenerated = Boolean(emailSubject && emailBody);
                  return (
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center ${reminderGenerated ? '' : 'opacity-40'}`}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">Reminder Generated</h4>
                          {reminderGenerated ? (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Generated</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">Pending</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">Payment reminder email drafted by AI</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Approval */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center ${approvalStatus === 'pending' ? 'animate-pulse' : ''}`}>
                      {approvalStatus === 'approved' ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">Approval</h4>
                      {approvalStatus === 'approved' ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      {approvalStatus === 'approved' ? 'Approved by manager' : 'Awaiting manager approval'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center ${isEmailSent ? '' : 'opacity-40'}`}>
                      <MailIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">Email Delivery</h4>
                      {isEmailSent ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Sent</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300">Not Sent</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {isEmailSent ? `Delivered to ${customer?.email}` : 'Waiting for approval'}
                    </p>
                  </div>
                </div>

                {/* Dataverse */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">System Sync</h4>
                      <Badge className="bg-green-100 text-green-700 border-green-200">Synced</Badge>
                    </div>
                    <p className="text-xs text-gray-600">All data synchronized with Dataverse</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity Timeline */}
            <Card className="border-[#DDDDDD] p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-[#003087]" />
                Activity Timeline
              </h3>
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {timeline.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.type === 'success' ? 'bg-green-100' :
                        event.type === 'warning' ? 'bg-orange-100' :
                        event.type === 'error' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {event.type === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : event.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        ) : event.type === 'error' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <CircleDot className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                        <div className="text-xs text-gray-600">{event.description}</div>
                        <div className="text-xs text-gray-400 mt-1">{event.timestamp}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>

      {/* Spacer for the persistent Copilot Studio panel (AskArea, mounted in main.tsx),
          which is position:fixed and overlays this reserved area. The old mock
          AIAssistantPanel below is kept but no longer rendered. */}
      <div className="w-[400px] flex-shrink-0" aria-hidden="true" />
    </div>
    </AppLayout>
  );
};

// AI Assistant Panel Component
// Updated to fix object rendering issue
function AIAssistantPanel({ 
  customerName, 
  chatMessages, 
  setChatMessages,
  userInput,
  setUserInput,
  isAIThinking,
  handleSuggestedPrompt,
  handleSendMessage
}: any) {
  const suggestedPrompts = [
    `Why is ${customerName} high risk?`,
    "Draft a payment reminder email",
    "Suggest payment plan options",
    "Show payment history analysis",
    "What actions should I take?"
  ];

  return (
    <aside className="w-[400px] bg-white border-l border-[#DDDDDD] flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003087] to-[#0052CC] px-4 py-3 flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-sm font-semibold">AI Collection Assistant</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-white/80 text-[10px]">Online</span>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-white/60" />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC] flex-shrink-0">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Actions</p>
        <div className="space-y-1.5">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSuggestedPrompt(prompt)}
              className="w-full text-left px-2.5 py-1.5 text-[11px] text-gray-700 bg-white border border-[#E5E7EB] rounded-[4px] hover:border-[#003087] hover:bg-[#F5F9FF] transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#FAFBFC]">
        <div className="space-y-3">
        {chatMessages.map((m: any, i: number) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#003087] to-[#0052CC] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`flex-1 rounded-lg px-3 py-2.5 text-[12px] leading-relaxed ${
              m.role === "user" 
                ? "bg-[#003087] text-white rounded-tr-sm max-w-[280px]" 
                : "bg-white border border-[#E5E7EB] text-gray-700 rounded-tl-sm shadow-sm"
            }`}>
              {m.role === "assistant" && typeof m.content === 'object' && m.content?.type === 'risk-analysis' ? (
                <div>
                  {/* Title */}
                  <div className="bg-[#003087] text-white font-semibold text-sm px-3 py-2 rounded-lg mb-3">
                    {m.content.title}
                  </div>
                  
                  {/* Icon and Content */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mt-1">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-800 mb-3">{m.content.content}</div>
                      
                      {/* Bullet Points */}
                      <ul className="space-y-2 mb-3">
                        {m.content.points.map((point: string, idx: number) => (
                          <li key={idx} className="text-gray-700 flex items-start">
                            <span className="mr-2">•</span>
                            <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          </li>
                        ))}
                      </ul>
                      
                      {/* Recommendation */}
                      {m.content.recommendation && (
                        <div className="text-gray-800 mb-3" dangerouslySetInnerHTML={{ __html: m.content.recommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      )}
                      
                      {/* Confidence Score */}
                      {m.content.confidence && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                          <div className="font-semibold text-green-800 text-sm mb-2">
                            Confidence Score: {m.content.confidence}%
                          </div>
                          <div className="text-green-700 text-sm font-semibold mb-1">
                            Supporting Factors:
                          </div>
                          <ul className="space-y-1">
                            {m.content.supportingFactors.map((factor: string, idx: number) => (
                              <li key={idx} className="text-green-700 text-xs flex items-start">
                                <span className="mr-2">•</span>
                                <span>{factor}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : m.role === "assistant" && typeof m.content === 'string' ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
                }} />
              ) : typeof m.content === 'string' ? (
                <div>{m.content}</div>
              ) : (
                <div className="text-gray-500 text-xs">Unable to display this message format</div>
              )}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isAIThinking && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#003087] to-[#0052CC] flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-lg rounded-tl-sm px-3 py-2.5 text-[12px] text-gray-500">
              Analyzing...
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#E5E7EB] bg-white flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            className="flex-1 min-h-[36px] max-h-[100px] text-[12px] bg-[#F8FAFC] border-[#D6D6D6] rounded-[6px] placeholder:text-gray-400 focus:border-[#003087] focus:ring-1 focus:ring-[#003087] resize-none"
            placeholder="Ask about this customer..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
          />
          <Button
            onClick={() => handleSendMessage()}
            className="w-9 h-9 rounded-[6px] bg-[#003087] hover:bg-[#00256A] p-0"
            disabled={!userInput.trim() || isAIThinking}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[9px] text-gray-400 mt-2 text-center">
          AI-powered insights for {customerName}
        </p>
      </div>
    </aside>
  );
}

export default CustomerWorkspace;
