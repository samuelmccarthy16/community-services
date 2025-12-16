import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Download,
  Mail,
  Users,
  Calendar,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
  BarChart3,
  UserCheck,
  Clock,
  Building,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  AlertCircle,
  TrendingUp,
  Globe,
  History,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Copy,
  Trash2
} from 'lucide-react';

interface Registration {
  id: string;
  conference_name: string;
  conference_date: string;
  conference_location: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  job_title: string;
  attendance_type: string;
  dietary_requirements: string;
  special_accommodations: string;
  how_heard: string;
  newsletter_opt_in: boolean;
  status: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

interface ConferenceStats {
  name: string;
  total: number;
  inPerson: number;
  virtual: number;
  checkedIn: number;
}

interface EmailLog {
  id: string;
  batchId: string;
  recipientEmail: string;
  recipientName: string;
  conferenceName: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  messageId?: string;
  error?: string;
  sentAt: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const CONFERENCES = [
  { title: 'Global Humanitarian Summit 2026', date: 'March 15-17, 2026' },
  { title: 'Mental Health & Community Care Conference', date: 'June 8-10, 2026' },
  { title: 'Education for All: Innovation Summit', date: 'September 22-24, 2026' }
];

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Registration Confirmation',
    subject: 'Your Registration for {conference_name} is Confirmed!',
    body: `Dear {first_name},

Thank you for registering for {conference_name}! We're excited to have you join us.

Your registration has been confirmed and you will receive additional details closer to the event date.

If you have any questions, please don't hesitate to reach out.

Best regards,
The Conference Team`
  },
  {
    id: '2',
    name: 'Event Reminder',
    subject: 'Reminder: {conference_name} is Coming Up!',
    body: `Dear {first_name},

This is a friendly reminder that {conference_name} is just around the corner!

Please make sure you have all the necessary arrangements in place. We look forward to seeing you there.

Best regards,
The Conference Team`
  },
  {
    id: '3',
    name: 'Important Update',
    subject: 'Important Update Regarding {conference_name}',
    body: `Dear {first_name},

We have an important update regarding {conference_name} that we wanted to share with you.

[Add your update here]

If you have any questions, please contact us.

Best regards,
The Conference Team`
  },
  {
    id: '4',
    name: 'Thank You',
    subject: 'Thank You for Attending {conference_name}!',
    body: `Dear {first_name},

Thank you for attending {conference_name}! We hope you found the event valuable and informative.

We would love to hear your feedback. Please take a moment to share your thoughts with us.

We hope to see you at future events!

Best regards,
The Conference Team`
  }
];

const AdminConferenceDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConference, setSelectedConference] = useState('all');
  const [selectedAttendanceType, setSelectedAttendanceType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [sortField, setSortField] = useState<keyof Registration>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  
  // Email tracking states
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailSendResult, setEmailSendResult] = useState<{
    success: boolean;
    batchId?: string;
    sent?: number;
    failed?: number;
    results?: any[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'registrations' | 'email-history'>('registrations');

  // Fetch registrations from database
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conference_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        setRegistrations(getMockRegistrations());
      } else {
        setRegistrations(data || getMockRegistrations());
      }
    } catch (err) {
      console.error('Error:', err);
      setRegistrations(getMockRegistrations());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    const savedLogs = localStorage.getItem('conferenceEmailLogs');
    if (savedLogs) {
      setEmailLogs(JSON.parse(savedLogs));
    }
  }, []);

  const saveEmailLogs = (logs: EmailLog[]) => {
    setEmailLogs(logs);
    localStorage.setItem('conferenceEmailLogs', JSON.stringify(logs));
  };

  const getMockRegistrations = (): Registration[] => [
    {
      id: '1',
      conference_name: 'Global Humanitarian Summit 2026',
      conference_date: 'March 15-17, 2026',
      conference_location: 'Geneva, Switzerland',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 555-0101',
      organization: 'UNICEF',
      job_title: 'Program Director',
      attendance_type: 'in-person',
      dietary_requirements: 'vegetarian',
      special_accommodations: '',
      how_heard: 'email',
      newsletter_opt_in: true,
      status: 'confirmed',
      checked_in: true,
      checked_in_at: '2026-03-15T09:30:00Z',
      created_at: '2025-12-01T10:00:00Z'
    },
    {
      id: '2',
      conference_name: 'Global Humanitarian Summit 2026',
      conference_date: 'March 15-17, 2026',
      conference_location: 'Geneva, Switzerland',
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael.chen@example.com',
      phone: '+1 555-0102',
      organization: 'Red Cross',
      job_title: 'Emergency Response Coordinator',
      attendance_type: 'in-person',
      dietary_requirements: '',
      special_accommodations: 'Wheelchair accessible seating',
      how_heard: 'colleague',
      newsletter_opt_in: true,
      status: 'confirmed',
      checked_in: false,
      checked_in_at: null,
      created_at: '2025-12-02T14:30:00Z'
    },
    {
      id: '3',
      conference_name: 'Mental Health & Community Care Conference',
      conference_date: 'June 8-10, 2026',
      conference_location: 'Toronto, Canada',
      first_name: 'Emily',
      last_name: 'Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+1 555-0103',
      organization: 'Mental Health Foundation',
      job_title: 'Clinical Psychologist',
      attendance_type: 'virtual',
      dietary_requirements: '',
      special_accommodations: '',
      how_heard: 'social-media',
      newsletter_opt_in: false,
      status: 'confirmed',
      checked_in: false,
      checked_in_at: null,
      created_at: '2025-12-03T09:15:00Z'
    },
    {
      id: '4',
      conference_name: 'Mental Health & Community Care Conference',
      conference_date: 'June 8-10, 2026',
      conference_location: 'Toronto, Canada',
      first_name: 'David',
      last_name: 'Kim',
      email: 'david.kim@example.com',
      phone: '+1 555-0104',
      organization: 'Community Health Center',
      job_title: 'Social Worker',
      attendance_type: 'in-person',
      dietary_requirements: 'vegan',
      special_accommodations: '',
      how_heard: 'website',
      newsletter_opt_in: true,
      status: 'confirmed',
      checked_in: false,
      checked_in_at: null,
      created_at: '2025-12-04T16:45:00Z'
    },
    {
      id: '5',
      conference_name: 'Education for All: Innovation Summit',
      conference_date: 'September 22-24, 2026',
      conference_location: 'Monrovia, Liberia',
      first_name: 'Amanda',
      last_name: 'Patel',
      email: 'amanda.patel@example.com',
      phone: '+1 555-0105',
      organization: 'UNESCO',
      job_title: 'Education Specialist',
      attendance_type: 'in-person',
      dietary_requirements: 'halal',
      special_accommodations: '',
      how_heard: 'partner-organization',
      newsletter_opt_in: true,
      status: 'confirmed',
      checked_in: false,
      checked_in_at: null,
      created_at: '2025-12-05T11:20:00Z'
    },
    {
      id: '6',
      conference_name: 'Education for All: Innovation Summit',
      conference_date: 'September 22-24, 2026',
      conference_location: 'Monrovia, Liberia',

      first_name: 'James',
      last_name: 'Wilson',
      email: 'james.wilson@example.com',
      phone: '+1 555-0106',
      organization: 'EdTech Solutions',
      job_title: 'CEO',
      attendance_type: 'virtual',
      dietary_requirements: '',
      special_accommodations: '',
      how_heard: 'search-engine',
      newsletter_opt_in: false,
      status: 'confirmed',
      checked_in: false,
      checked_in_at: null,
      created_at: '2025-12-06T08:00:00Z'
    },
    {
      id: '7',
      conference_name: 'Global Humanitarian Summit 2026',
      conference_date: 'March 15-17, 2026',
      conference_location: 'Geneva, Switzerland',
      first_name: 'Lisa',
      last_name: 'Thompson',
      email: 'lisa.thompson@example.com',
      phone: '+1 555-0107',
      organization: 'World Food Programme',
      job_title: 'Regional Manager',
      attendance_type: 'virtual',
      dietary_requirements: '',
      special_accommodations: '',
      how_heard: 'previous-attendee',
      newsletter_opt_in: true,
      status: 'confirmed',
      checked_in: false,
      checked_in_at: null,
      created_at: '2025-12-07T13:30:00Z'
    },
    {
      id: '8',
      conference_name: 'Mental Health & Community Care Conference',
      conference_date: 'June 8-10, 2026',
      conference_location: 'Toronto, Canada',
      first_name: 'Robert',
      last_name: 'Garcia',
      email: 'robert.garcia@example.com',
      phone: '+1 555-0108',
      organization: 'Private Practice',
      job_title: 'Psychiatrist',
      attendance_type: 'in-person',
      dietary_requirements: 'gluten-free',
      special_accommodations: '',
      how_heard: 'email',
      newsletter_opt_in: true,
      status: 'confirmed',
      checked_in: false,
      checked_in_at: null,
      created_at: '2025-12-08T10:45:00Z'
    }
  ];

  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.first_name.toLowerCase().includes(term) ||
        r.last_name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.organization?.toLowerCase().includes(term)
      );
    }

    if (selectedConference !== 'all') {
      filtered = filtered.filter(r => r.conference_name === selectedConference);
    }

    if (selectedAttendanceType !== 'all') {
      filtered = filtered.filter(r => r.attendance_type === selectedAttendanceType);
    }

    if (dateRange.start) {
      filtered = filtered.filter(r => new Date(r.created_at) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(r => new Date(r.created_at) <= new Date(dateRange.end + 'T23:59:59'));
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [registrations, searchTerm, selectedConference, selectedAttendanceType, dateRange, sortField, sortDirection]);

  const stats = useMemo((): ConferenceStats[] => {
    return CONFERENCES.map(conf => {
      const confRegs = registrations.filter(r => r.conference_name === conf.title);
      return {
        name: conf.title,
        total: confRegs.length,
        inPerson: confRegs.filter(r => r.attendance_type === 'in-person').length,
        virtual: confRegs.filter(r => r.attendance_type === 'virtual').length,
        checkedIn: confRegs.filter(r => r.checked_in).length
      };
    });
  }, [registrations]);

  const totalStats = useMemo(() => ({
    total: registrations.length,
    inPerson: registrations.filter(r => r.attendance_type === 'in-person').length,
    virtual: registrations.filter(r => r.attendance_type === 'virtual').length,
    checkedIn: registrations.filter(r => r.checked_in).length
  }), [registrations]);

  const emailStats = useMemo(() => ({
    total: emailLogs.length,
    sent: emailLogs.filter(l => l.status === 'sent').length,
    failed: emailLogs.filter(l => l.status === 'failed').length,
    pending: emailLogs.filter(l => l.status === 'pending').length
  }), [emailLogs]);

  const exportToCSV = () => {
    const headers = [
      'Conference', 'First Name', 'Last Name', 'Email', 'Phone', 'Organization',
      'Job Title', 'Attendance Type', 'Dietary Requirements', 'Special Accommodations',
      'How Heard', 'Newsletter Opt-in', 'Status', 'Checked In', 'Checked In At', 'Registration Date'
    ];

    const rows = filteredRegistrations.map(r => [
      r.conference_name, r.first_name, r.last_name, r.email, r.phone || '',
      r.organization || '', r.job_title || '', r.attendance_type,
      r.dietary_requirements || '', r.special_accommodations || '', r.how_heard || '',
      r.newsletter_opt_in ? 'Yes' : 'No', r.status, r.checked_in ? 'Yes' : 'No',
      r.checked_in_at ? new Date(r.checked_in_at).toLocaleString() : '',
      new Date(r.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `conference_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCheckIn = async (registration: Registration) => {
    setCheckingIn(registration.id);
    try {
      const newCheckedIn = !registration.checked_in;
      const { error } = await supabase
        .from('conference_registrations')
        .update({
          checked_in: newCheckedIn,
          checked_in_at: newCheckedIn ? new Date().toISOString() : null
        })
        .eq('id', registration.id);

      if (error) {
        console.error('Error updating check-in:', error);
      }

      setRegistrations(prev =>
        prev.map(r =>
          r.id === registration.id
            ? { ...r, checked_in: newCheckedIn, checked_in_at: newCheckedIn ? new Date().toISOString() : null }
            : r
        )
      );
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setCheckingIn(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedRegistrations.length === filteredRegistrations.length) {
      setSelectedRegistrations([]);
    } else {
      setSelectedRegistrations(filteredRegistrations.map(r => r.id));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedRegistrations(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
      setSelectedTemplate(templateId);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject || !emailBody) {
      alert('Please enter both subject and message');
      return;
    }

    setSendingEmail(true);
    setEmailSendResult(null);

    try {
      const selectedRecipients = registrations
        .filter(r => selectedRegistrations.includes(r.id))
        .map(r => ({
          email: r.email,
          firstName: r.first_name,
          lastName: r.last_name,
          conferenceName: r.conference_name,
          registrationId: r.id
        }));

      const batchId = `batch_${Date.now()}`;
      const results: any[] = [];

      // Send emails using the edge function
      for (const recipient of selectedRecipients) {
        try {
          const personalizedSubject = emailSubject
            .replace(/{first_name}/gi, recipient.firstName)
            .replace(/{last_name}/gi, recipient.lastName)
            .replace(/{conference_name}/gi, recipient.conferenceName);

          const personalizedBody = emailBody
            .replace(/{first_name}/gi, recipient.firstName)
            .replace(/{last_name}/gi, recipient.lastName)
            .replace(/{conference_name}/gi, recipient.conferenceName);

          const { data, error } = await supabase.functions.invoke('send-contact-email', {
            body: {
              name: `${recipient.firstName} ${recipient.lastName}`,
              email: recipient.email,
              subject: personalizedSubject,
              message: personalizedBody,
              isBulkEmail: true,
              conferenceName: recipient.conferenceName,
              batchId: batchId
            }
          });

          if (error) {
            console.error(`Error sending to ${recipient.email}:`, error);
            results.push({
              email: recipient.email,
              registrationId: recipient.registrationId,
              status: 'failed',
              error: error.message || 'Failed to send'
            });
          } else {
            results.push({
              email: recipient.email,
              registrationId: recipient.registrationId,
              status: 'sent',
              messageId: data?.data?.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            });
          }

          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err: any) {
          console.error(`Error processing ${recipient.email}:`, err);
          results.push({
            email: recipient.email,
            registrationId: recipient.registrationId,
            status: 'failed',
            error: err.message || 'Unknown error'
          });
        }
      }

      const sentCount = results.filter(r => r.status === 'sent').length;
      const failedCount = results.filter(r => r.status === 'failed').length;

      setEmailSendResult({
        success: true,
        batchId,
        sent: sentCount,
        failed: failedCount,
        results
      });

      const newLogs: EmailLog[] = results.map((result, index) => ({
        id: `${Date.now()}_${index}`,
        batchId,
        recipientEmail: result.email,
        recipientName: `${selectedRecipients[index].firstName} ${selectedRecipients[index].lastName}`,
        conferenceName: selectedRecipients[index].conferenceName,
        subject: emailSubject,
        status: result.status,
        messageId: result.messageId,
        error: result.error,
        sentAt: new Date().toISOString()
      }));

      saveEmailLogs([...newLogs, ...emailLogs]);
    } catch (err) {
      console.error('Error sending emails:', err);
      alert('Failed to send emails. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
    setSelectedTemplate('');
    setEmailSendResult(null);
    if (emailSendResult?.success) {
      setSelectedRegistrations([]);
    }
  };

  const handleSort = (field: keyof Registration) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof Registration }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const clearEmailHistory = () => {
    if (confirm('Are you sure you want to clear all email history?')) {
      saveEmailLogs([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Conference Registrations</h2>
          <p className="text-gray-600">Manage attendee registrations for all conferences</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => fetchRegistrations()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab(activeTab === 'registrations' ? 'email-history' : 'registrations')}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            {activeTab === 'registrations' ? 'Email History' : 'Registrations'}
          </Button>
          <Button
            onClick={() => setShowEmailModal(true)}
            disabled={selectedRegistrations.length === 0}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="h-4 w-4" />
            Email Selected ({selectedRegistrations.length})
          </Button>
        </div>
      </div>

      {activeTab === 'registrations' ? (
        <>
          {/* Statistics */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Registration Statistics
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowStats(!showStats)}>
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </Button>
          </div>

          {showStats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Total Registrations</p>
                      <p className="text-2xl font-bold text-blue-900">{totalStats.total}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-600 rounded-xl">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-700">In-Person</p>
                      <p className="text-2xl font-bold text-green-900">{totalStats.inPerson}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-600 rounded-xl">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-700">Virtual</p>
                      <p className="text-2xl font-bold text-purple-900">{totalStats.virtual}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-600 rounded-xl">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-700">Checked In</p>
                      <p className="text-2xl font-bold text-amber-900">{totalStats.checkedIn}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm truncate" title={stat.name}>
                      {stat.name}
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xl font-bold text-blue-600">{stat.total}</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600">{stat.inPerson}</p>
                        <p className="text-xs text-gray-500">In-Person</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-purple-600">{stat.virtual}</p>
                        <p className="text-xs text-gray-500">Virtual</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-amber-600">{stat.checkedIn}</p>
                        <p className="text-xs text-gray-500">Checked In</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Check-in Progress</span>
                        <span>{stat.inPerson > 0 ? Math.round((stat.checkedIn / stat.inPerson) * 100) : 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                          style={{ width: `${stat.inPerson > 0 ? (stat.checkedIn / stat.inPerson) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Filters */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-800">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Name, email, organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conference</label>
                <select
                  value={selectedConference}
                  onChange={(e) => setSelectedConference(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Conferences</option>
                  {CONFERENCES.map((conf, index) => (
                    <option key={index} value={conf.title}>{conf.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Type</label>
                <select
                  value={selectedAttendanceType}
                  onChange={(e) => setSelectedAttendanceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="in-person">In-Person</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredRegistrations.length} of {registrations.length} registrations
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedConference('all');
                  setSelectedAttendanceType('all');
                  setDateRange({ start: '', end: '' });
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRegistrations.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('first_name')}>
                      <div className="flex items-center gap-1">Attendee<SortIcon field="first_name" /></div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('conference_name')}>
                      <div className="flex items-center gap-1">Conference<SortIcon field="conference_name" /></div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attendance</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('organization')}>
                      <div className="flex items-center gap-1">Organization<SortIcon field="organization" /></div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>
                      <div className="flex items-center gap-1">Registered<SortIcon field="created_at" /></div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Check-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
                        <p className="text-gray-500">Loading registrations...</p>
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No registrations found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRegistrations.includes(registration.id)}
                            onChange={() => handleSelectOne(registration.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{registration.first_name} {registration.last_name}</p>
                            <p className="text-sm text-gray-500">{registration.email}</p>
                            {registration.phone && <p className="text-xs text-gray-400">{registration.phone}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800 text-sm max-w-[200px] truncate" title={registration.conference_name}>{registration.conference_name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{registration.conference_date}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={registration.attendance_type === 'in-person' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}>
                            {registration.attendance_type === 'in-person' ? <MapPin className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                            {registration.attendance_type}
                          </Badge>
                          {registration.dietary_requirements && <p className="text-xs text-gray-500 mt-1">Diet: {registration.dietary_requirements}</p>}
                        </td>
                        <td className="px-4 py-3">
                          {registration.organization ? (
                            <div>
                              <p className="text-sm text-gray-800 flex items-center gap-1"><Building className="h-3 w-3 text-gray-400" />{registration.organization}</p>
                              {registration.job_title && <p className="text-xs text-gray-500">{registration.job_title}</p>}
                            </div>
                          ) : <span className="text-gray-400 text-sm">-</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600"><Clock className="h-3 w-3" />{new Date(registration.created_at).toLocaleDateString()}</div>
                          <p className="text-xs text-gray-400">{new Date(registration.created_at).toLocaleTimeString()}</p>
                        </td>
                        <td className="px-4 py-3">
                          {registration.attendance_type === 'in-person' ? (
                            <Button
                              size="sm"
                              variant={registration.checked_in ? 'default' : 'outline'}
                              onClick={() => handleCheckIn(registration)}
                              disabled={checkingIn === registration.id}
                              className={registration.checked_in ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300 hover:bg-gray-50'}
                            >
                              {checkingIn === registration.id ? <Loader2 className="h-4 w-4 animate-spin" /> : registration.checked_in ? <><CheckCircle className="h-4 w-4 mr-1" />Checked In</> : <><UserCheck className="h-4 w-4 mr-1" />Check In</>}
                            </Button>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-500"><Globe className="h-3 w-3 mr-1" />Virtual</Badge>
                          )}
                          {registration.checked_in && registration.checked_in_at && <p className="text-xs text-green-600 mt-1">{new Date(registration.checked_in_at).toLocaleTimeString()}</p>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        /* Email History Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl"><Mail className="h-6 w-6 text-white" /></div>
                <div>
                  <p className="text-sm text-blue-700">Total Emails</p>
                  <p className="text-2xl font-bold text-blue-900">{emailStats.total}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-xl"><CheckCircle2 className="h-6 w-6 text-white" /></div>
                <div>
                  <p className="text-sm text-green-700">Sent</p>
                  <p className="text-2xl font-bold text-green-900">{emailStats.sent}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 rounded-xl"><XCircle className="h-6 w-6 text-white" /></div>
                <div>
                  <p className="text-sm text-red-700">Failed</p>
                  <p className="text-2xl font-bold text-red-900">{emailStats.failed}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-600 rounded-xl"><TrendingUp className="h-6 w-6 text-white" /></div>
                <div>
                  <p className="text-sm text-amber-700">Success Rate</p>
                  <p className="text-2xl font-bold text-amber-900">{emailStats.total > 0 ? Math.round((emailStats.sent / emailStats.total) * 100) : 0}%</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2"><History className="h-5 w-5 text-blue-600" />Email Delivery History</h3>
              {emailLogs.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearEmailHistory} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />Clear History
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Recipient</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Conference</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sent At</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Message ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {emailLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <Mail className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">No email history yet</p>
                        <p className="text-sm text-gray-400">Send bulk emails to see delivery tracking here</p>
                      </td>
                    </tr>
                  ) : (
                    emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Badge className={log.status === 'sent' ? 'bg-green-100 text-green-700' : log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                            {log.status === 'sent' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {log.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                            {log.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {log.status}
                          </Badge>
                          {log.error && <p className="text-xs text-red-500 mt-1">{log.error}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{log.recipientName}</p>
                          <p className="text-sm text-gray-500">{log.recipientEmail}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-700 max-w-[150px] truncate" title={log.conferenceName}>{log.conferenceName}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-700 max-w-[200px] truncate" title={log.subject}>{log.subject}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-600">{new Date(log.sentAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">{new Date(log.sentAt).toLocaleTimeString()}</p>
                        </td>
                        <td className="px-4 py-3">
                          {log.messageId ? (
                            <div className="flex items-center gap-1">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 max-w-[100px] truncate">{log.messageId}</code>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => navigator.clipboard.writeText(log.messageId || '')}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : <span className="text-gray-400 text-sm">-</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            {emailSendResult ? (
              <div className="space-y-6">
                <div className="text-center">
                  {emailSendResult.failed === 0 ? (
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  ) : emailSendResult.sent === 0 ? (
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                      <AlertTriangle className="h-8 w-8 text-amber-600" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800">
                    {emailSendResult.failed === 0 ? 'All Emails Sent Successfully!' : emailSendResult.sent === 0 ? 'Email Sending Failed' : 'Emails Partially Sent'}
                  </h3>
                  <p className="text-gray-600 mt-2">Batch ID: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{emailSendResult.batchId}</code></p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-700">{emailSendResult.sent}</p>
                      <p className="text-sm text-green-600">Successfully Sent</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-red-50 border-red-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-700">{emailSendResult.failed}</p>
                      <p className="text-sm text-red-600">Failed</p>
                    </div>
                  </Card>
                </div>

                {emailSendResult.results && emailSendResult.results.some(r => r.status === 'failed') && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4" />Failed Deliveries</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {emailSendResult.results.filter(r => r.status === 'failed').map((result, index) => (
                        <div key={index} className="text-sm text-red-700 flex items-center gap-2">
                          <XCircle className="h-3 w-3 flex-shrink-0" />
                          <span>{result.email}</span>
                          {result.error && <span className="text-red-500">- {result.error}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={closeEmailModal} className="w-full bg-blue-600 hover:bg-blue-700">Close</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Send Bulk Email</h3>
                    <p className="text-sm text-gray-600">Sending to {selectedRegistrations.length} selected attendees</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeEmailModal}><XCircle className="h-5 w-5" /></Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Email Templates</label>
                      <Button variant="ghost" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
                        <FileText className="h-4 w-4 mr-1" />{showTemplates ? 'Hide Templates' : 'Show Templates'}
                      </Button>
                    </div>
                    {showTemplates && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => applyTemplate(template.id)}
                            className={`p-3 text-left border rounded-lg transition-all ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                          >
                            <p className="font-medium text-gray-800 text-sm">{template.name}</p>
                            <p className="text-xs text-gray-500 truncate">{template.subject}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                    <Input placeholder="Enter email subject..." value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                    <textarea
                      placeholder="Enter your message..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        Placeholders: <code className="bg-gray-100 px-1 rounded">{'{first_name}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{last_name}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{conference_name}'}</code>
                      </p>
                      <p className="text-xs text-gray-400">{emailBody.length} characters</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2"><Users className="h-4 w-4" />Recipients Preview ({selectedRegistrations.length})</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {registrations.filter(r => selectedRegistrations.includes(r.id)).map(r => (
                        <div key={r.id} className="flex items-center justify-between text-sm">
                          <span className="text-blue-700">{r.first_name} {r.last_name}</span>
                          <span className="text-blue-500 text-xs">{r.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {emailSubject && emailBody && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Email Preview</span>
                      </div>
                      <div className="p-4 bg-white">
                        <p className="text-sm text-gray-500 mb-1">Subject:</p>
                        <p className="font-medium text-gray-800 mb-3">
                          {emailSubject.replace(/{first_name}/gi, 'John').replace(/{last_name}/gi, 'Doe').replace(/{conference_name}/gi, 'Global Humanitarian Summit 2026')}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">Body:</p>
                        <div className="text-gray-700 whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded border">
                          {emailBody.replace(/{first_name}/gi, 'John').replace(/{last_name}/gi, 'Doe').replace(/{conference_name}/gi, 'Global Humanitarian Summit 2026')}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={closeEmailModal} className="flex-1">Cancel</Button>
                    <Button
                      onClick={handleSendBulkEmail}
                      disabled={sendingEmail || !emailSubject || !emailBody}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {sendingEmail ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : <><Send className="h-4 w-4 mr-2" />Send to {selectedRegistrations.length} Recipients</>}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminConferenceDashboard;
