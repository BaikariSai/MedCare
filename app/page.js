'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Phone, Mail, MapPin, Clock, Calendar, Star, Heart, Brain, Bone,
  Baby, Stethoscope, Eye, Ear, Scissors, Activity, ChevronRight,
  Menu, X, User, LogIn, LogOut, Shield, Ambulance, AlertTriangle,
  Building2, Users, FileText, MessageSquare, Search, ArrowRight,
  CheckCircle, Award, Sparkles, ChevronDown, Home, Info, Briefcase,
  Globe, Facebook, Twitter, Instagram, Linkedin, Youtube,
  BarChart3, CalendarDays, UserCheck, XCircle, BookOpen, Send,
  PhoneCall, MapPinned, ClipboardList, Pill, FlaskConical, Scan,
  Dumbbell, Droplets, Truck, MonitorCheck, Video, CircleDot,
  Trash2, ExternalLink, Copy, Database, ChevronLeft
} from 'lucide-react';

// ============== CONSTANTS ==============
const HERO_IMG = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=800&fit=crop';
const HOSPITAL_IMG = 'https://images.unsplash.com/photo-1597807037496-c56a1d8bc29a?w=1200&h=600&fit=crop';

const DEPT_ICONS = {
  Heart, Brain, Bone, Baby, Shield, Sparkles, Eye, Ear, Scissors, Stethoscope,
};

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500',
  'bg-emerald-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-orange-500', 'bg-green-500',
];

const TESTIMONIALS = [
  { name: 'Rahul Mehra', text: 'The cardiac team at MedCare saved my life. Dr. Sharma\'s expertise and the nursing staff\'s dedicated care was truly exceptional. I am forever grateful.', rating: 5, department: 'Cardiology' },
  { name: 'Priyanka Sharma', text: 'Brought my daughter here for pediatric care. Dr. Reddy is wonderful with children. The facilities are world-class and the staff is incredibly warm.', rating: 5, department: 'Pediatrics' },
  { name: 'Suresh Kumar', text: 'After my knee replacement by Dr. Kumar, I\'m walking pain-free again. The rehabilitation program was excellent. Highly recommend MedCare!', rating: 5, department: 'Orthopedics' },
  { name: 'Anjali Verma', text: 'Dr. Patel diagnosed my neurological condition when other doctors couldn\'t. Her thoroughness and compassion made all the difference in my treatment.', rating: 5, department: 'Neurology' },
];

const SERVICES_LIST = [
  { name: 'Emergency & Trauma', icon: Ambulance, desc: '24/7 emergency services with rapid response team and fully equipped trauma center.' },
  { name: 'ICU & Critical Care', icon: Activity, desc: 'State-of-the-art ICU with advanced monitoring and life support systems.' },
  { name: 'Pharmacy', icon: Pill, desc: '24-hour pharmacy with a wide range of medicines and trained pharmacists.' },
  { name: 'Laboratory', icon: FlaskConical, desc: 'NABL-accredited lab offering 500+ diagnostic tests with quick turnaround.' },
  { name: 'Radiology & Imaging', icon: Scan, desc: 'Advanced imaging including MRI, CT scan, X-ray, ultrasound, and mammography.' },
  { name: 'Physiotherapy', icon: Dumbbell, desc: 'Comprehensive rehabilitation with modern equipment and expert physiotherapists.' },
  { name: 'Blood Bank', icon: Droplets, desc: 'Licensed blood bank ensuring safe blood supply for transfusions and surgeries.' },
  { name: 'Ambulance Service', icon: Truck, desc: 'Fleet of advanced ambulances with paramedics available round the clock.' },
  { name: 'Health Packages', icon: ClipboardList, desc: 'Customized preventive health check-up packages for all age groups.' },
  { name: 'Telemedicine', icon: Video, desc: 'Virtual consultations with specialists from the comfort of your home.' },
];

function getInitials(name) {
  return name?.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}

// ============== SETUP PAGE ==============
function SetupPage({ sql, onRetry }) {
  const [copied, setCopied] = useState(false);

  const copySQL = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    toast.success('SQL copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Database Setup Required</CardTitle>
          <CardDescription className="text-base">Your Supabase database needs tables to be created. This is a one-time setup.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2"><Info className="h-4 w-4" /> Steps to complete setup:</h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Copy the SQL below using the button</li>
              <li>Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">Supabase Dashboard</a></li>
              <li>Go to <strong>SQL Editor</strong> (left sidebar)</li>
              <li>Click <strong>New Query</strong>, paste the SQL, and click <strong>Run</strong></li>
              <li>Come back here and click <strong>Verify & Continue</strong></li>
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="font-semibold">SQL Script</Label>
              <Button onClick={copySQL} variant="outline" size="sm" className="gap-1">
                {copied ? <CheckCircle className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy SQL'}
              </Button>
            </div>
            <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{sql}</pre>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={onRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="mr-2 h-4 w-4" /> Verify & Continue
            </Button>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-1">
                <ExternalLink className="h-4 w-4" /> Open Supabase
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== TOP BAR ==============
function TopBar() {
  return (
    <div className="bg-blue-900 text-white text-sm py-2">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Saket, New Delhi, India</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Mon-Sat: 8AM-8PM | Emergency: 24/7</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+911800123456" className="flex items-center gap-1 hover:text-blue-200 transition"><Phone className="h-3.5 w-3.5" /> 1800-123-456</a>
          <a href="mailto:info@medcare.com" className="flex items-center gap-1 hover:text-blue-200 transition"><Mail className="h-3.5 w-3.5" /> info@medcare.com</a>
        </div>
      </div>
    </div>
  );
}

// ============== HEADER ==============
function Header({ currentPage, navigate, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'about', label: 'About Us', icon: Info },
    { key: 'specialities', label: 'Specialities', icon: CircleDot },
    { key: 'doctors', label: 'Doctors', icon: Users },
    { key: 'services', label: 'Services', icon: Briefcase },
    { key: 'blog', label: 'Blog', icon: BookOpen },
    { key: 'contact', label: 'Contact', icon: MessageSquare },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigate('home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-blue-900 leading-tight">MedCare</h1>
              <p className="text-[10px] text-gray-500 leading-tight -mt-0.5">Multi-Speciality Hospital</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button key={item.key} onClick={() => navigate(item.key)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.key ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('emergency')} variant="destructive" size="sm" className="hidden sm:flex gap-1">
              <Ambulance className="h-4 w-4" /> Emergency
            </Button>
            <Button onClick={() => navigate('appointment')} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-1" /> Book Now
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Button onClick={() => navigate('admin')} variant="outline" size="sm">
                    <Shield className="h-4 w-4" />
                  </Button>
                )}
                <Button onClick={onLogout} variant="ghost" size="sm"><LogOut className="h-4 w-4" /></Button>
              </div>
            ) : (
              <Button onClick={() => navigate('auth')} variant="ghost" size="sm"><User className="h-4 w-4" /></Button>
            )}
            <Button onClick={() => setMobileOpen(!mobileOpen)} variant="ghost" size="sm" className="lg:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t">
            {navItems.map(item => (
              <button key={item.key} onClick={() => { navigate(item.key); setMobileOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-md transition ${
                  currentPage === item.key ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <item.icon className="h-4 w-4" /> {item.label}
              </button>
            ))}
            <Button onClick={() => { navigate('emergency'); setMobileOpen(false); }} variant="destructive" className="w-full mt-2">
              <Ambulance className="h-4 w-4 mr-2" /> Emergency
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

// ============== FOOTER ==============
function Footer({ navigate }) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">MedCare</h3>
                <p className="text-xs text-gray-500">Multi-Speciality Hospital</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Providing world-class healthcare with compassion and excellence since 1998.</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['home', 'about', 'doctors', 'specialities', 'services', 'blog', 'contact'].map(key => (
                <button key={key} onClick={() => navigate(key)} className="block text-sm text-gray-400 hover:text-white transition capitalize">{key}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Departments</h4>
            <div className="space-y-2">
              {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Dermatology'].map(d => (
                <button key={d} onClick={() => navigate('specialities')} className="block text-sm text-gray-400 hover:text-white transition">{d}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <p className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" /> MedCare Hospital, Saket, New Delhi - 110017</p>
              <p className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4" /> +91 1800-123-456</p>
              <p className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4" /> info@medcare.com</p>
              <p className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4" /> Mon-Sat: 8AM-8PM</p>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-gray-800" />
        <p className="text-center text-sm text-gray-500">&copy; 2025 MedCare Multi-Speciality Hospital. All rights reserved.</p>
      </div>
    </footer>
  );
}


// ============== HOME PAGE ==============
function HomePage({ departments, doctors, navigate }) {
  return (
    <>
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/80 to-blue-900/60 z-10" />
        <img src={HERO_IMG} alt="Hospital" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 container mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-6 text-sm px-4 py-1">Trusted Healthcare Since 1998</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Your Health,<br/>Our <span className="text-blue-300">Priority</span></h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">World-class healthcare with compassion and excellence. 200+ expert doctors across 30+ specialities.</p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('appointment')} size="lg" className="bg-blue-500 hover:bg-blue-400 text-white px-8"><Calendar className="mr-2 h-5 w-5" /> Book Appointment</Button>
              <Button onClick={() => navigate('emergency')} size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 px-8"><Phone className="mr-2 h-5 w-5" /> Emergency: 108</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 -mt-12 relative z-30">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[{ num: '25+', label: 'Years', icon: Award },{ num: '200+', label: 'Doctors', icon: Users },{ num: '50K+', label: 'Patients', icon: UserCheck },{ num: '30+', label: 'Specialities', icon: CircleDot },{ num: '24/7', label: 'Emergency', icon: Ambulance },{ num: '500+', label: 'Beds', icon: Building2 }].map((s, i) => (
              <div key={i} className="text-center"><s.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" /><p className="text-2xl font-bold text-gray-900">{s.num}</p><p className="text-xs text-gray-500">{s.label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"><Badge variant="outline" className="mb-3 text-blue-600 border-blue-200">Our Specialities</Badge><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Departments of Excellence</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(departments || []).slice(0, 10).map((dept, i) => {
              const IconComp = DEPT_ICONS[dept.icon] || Stethoscope;
              return (<Card key={dept.id} className="hover:shadow-lg transition-all cursor-pointer group border-0 shadow-sm hover:-translate-y-1" onClick={() => navigate('specialities', { department: dept })}><CardContent className="p-6 text-center"><div className={`w-14 h-14 ${COLORS[i % COLORS.length]} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}><IconComp className="h-7 w-7 text-white" /></div><h3 className="font-semibold text-gray-900 text-sm">{dept.name}</h3></CardContent></Card>);
            })}
          </div>
          <div className="text-center mt-8"><Button onClick={() => navigate('specialities')} variant="outline" className="text-blue-600 border-blue-200">View All <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"><Badge variant="outline" className="mb-3 text-blue-600 border-blue-200">Our Experts</Badge><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Specialists</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(doctors || []).filter(d => d.featured).slice(0, 4).map((doc, i) => (
              <Card key={doc.id} className="hover:shadow-lg transition-all cursor-pointer group border-0 shadow-sm" onClick={() => navigate('doctor-detail', { doctor: doc })}>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mb-4 ring-4 ring-blue-100 mx-auto"><AvatarFallback className={`${COLORS[i % COLORS.length]} text-white text-xl font-bold`}>{getInitials(doc.name)}</AvatarFallback></Avatar>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{doc.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-1">{doc.department}</p>
                  <p className="text-gray-500 text-xs mb-3">{doc.qualification}</p>
                  <div className="flex items-center justify-center gap-1 mb-2"><Star className="h-4 w-4 text-yellow-400" fill="currentColor" /><span className="font-semibold text-sm">{doc.rating}</span><span className="text-gray-400 text-xs">({doc.reviews})</span></div>
                  <Badge variant="secondary" className="text-xs">{doc.experience} Years Experience</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8"><Button onClick={() => navigate('doctors')} variant="outline" className="text-blue-600 border-blue-200">View All Doctors <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"><Badge variant="outline" className="mb-3 text-blue-600 border-blue-200">Testimonials</Badge><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="border-0 shadow-sm hover:shadow-md transition"><CardContent className="p-6">
                <div className="flex gap-0.5 mb-4">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" />)}</div>
                <p className="text-gray-600 text-sm mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3"><Avatar className="w-10 h-10"><AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-bold">{getInitials(t.name)}</AvatarFallback></Avatar><div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-gray-500">{t.department}</p></div></div>
              </CardContent></Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-600 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-white"><div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Ambulance className="h-7 w-7" /></div><div><h3 className="text-xl font-bold">24/7 Emergency Services</h3><p className="text-red-100">Immediate medical attention when you need it most</p></div></div>
          <Button onClick={() => navigate('emergency')} className="bg-white text-red-600 hover:bg-red-50 font-bold"><Phone className="mr-2 h-4 w-4" /> Call Now: 108</Button>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready for World-Class Healthcare?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">Book your appointment today and take the first step towards better health.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate('appointment')} size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8"><Calendar className="mr-2 h-5 w-5" /> Book Appointment</Button>
            <Button onClick={() => navigate('contact')} size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 px-8">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </div>
        </div>
      </section>
    </>
  );
}

// ============== ABOUT PAGE ==============
function AboutPage({ navigate }) {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4">About Us</Badge><h1 className="text-4xl font-bold text-white mb-4">Our Story of Excellence</h1><p className="text-blue-100 text-lg max-w-2xl">Serving the community with world-class healthcare since 1998.</p></div></section>
      <section className="py-16"><div className="container mx-auto px-4"><div className="grid md:grid-cols-2 gap-12 items-center"><div><h2 className="text-3xl font-bold text-gray-900 mb-6">A Legacy of Healing</h2><p className="text-gray-600 mb-4">Founded in 1998, MedCare Multi-Speciality Hospital has been at the forefront of healthcare innovation in New Delhi. With over 200 expert doctors across 30+ specialities, we serve over 50,000 patients annually.</p><p className="text-gray-600">We are accredited by NABH and JCI, reflecting our dedication to maintaining the highest standards of healthcare quality and patient safety.</p></div><div className="rounded-2xl overflow-hidden shadow-xl"><img src={HOSPITAL_IMG} alt="MedCare Hospital" className="w-full h-80 object-cover" /></div></div></div></section>
      <section className="py-16 bg-gray-50"><div className="container mx-auto px-4"><div className="grid md:grid-cols-2 gap-8">
        <Card className="border-0 shadow-md"><CardContent className="p-8"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><Eye className="h-6 w-6 text-blue-600" /></div><h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3><p className="text-gray-600">To be the most trusted healthcare provider in India, recognized for clinical excellence and innovative medical practices.</p></CardContent></Card>
        <Card className="border-0 shadow-md"><CardContent className="p-8"><div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4"><Heart className="h-6 w-6 text-teal-600" /></div><h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3><p className="text-gray-600">To provide accessible, affordable, and high-quality healthcare combining advanced technology with compassionate care.</p></CardContent></Card>
      </div></div></section>
      <section className="py-16"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl font-bold text-gray-900 mb-12">Leadership Team</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[{ name: 'Dr. Vikram Kapoor', role: 'Chairman & MD', exp: '35+ years' },{ name: 'Dr. Anita Sharma', role: 'Medical Director', exp: '28+ years' },{ name: 'Rajiv Khanna', role: 'COO', exp: '20+ years' }].map((l, i) => (
          <Card key={i} className="border-0 shadow-sm"><CardContent className="p-8 text-center"><Avatar className="w-24 h-24 mx-auto mb-4"><AvatarFallback className={`${COLORS[i]} text-white text-xl font-bold`}>{getInitials(l.name)}</AvatarFallback></Avatar><h3 className="font-bold text-gray-900 text-lg">{l.name}</h3><p className="text-blue-600 font-medium text-sm mb-1">{l.role}</p><p className="text-gray-500 text-sm">{l.exp}</p></CardContent></Card>
        ))}
      </div></div></section>
    </>
  );
}

// ============== SPECIALITIES PAGE ==============
function SpecialitiesPage({ departments, navigate, selectedDepartment }) {
  const [activeDept, setActiveDept] = useState(selectedDepartment || null);
  if (activeDept) {
    const IconComp = DEPT_ICONS[activeDept.icon] || Stethoscope;
    return (<><section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><button onClick={() => setActiveDept(null)} className="text-blue-200 hover:text-white text-sm mb-4 flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> All Specialities</button><div className="flex items-center gap-4"><div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center"><IconComp className="h-8 w-8 text-white" /></div><div><h1 className="text-4xl font-bold text-white">{activeDept.name}</h1></div></div></div></section>
      <section className="py-16"><div className="container mx-auto px-4"><div className="grid md:grid-cols-3 gap-8"><div className="md:col-span-2"><h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2><p className="text-gray-600 mb-8 text-lg">{activeDept.description}</p><h3 className="text-xl font-bold mb-4">Services</h3><div className="grid sm:grid-cols-2 gap-3">{(activeDept.services || []).map((s, i) => <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"><CheckCircle className="h-5 w-5 text-blue-600" /><span className="text-gray-700 text-sm font-medium">{s}</span></div>)}</div></div>
        <div><Card className="border-0 shadow-md sticky top-24"><CardContent className="p-6"><h3 className="font-bold mb-4">Need Consultation?</h3><Button onClick={() => navigate('appointment')} className="w-full bg-blue-600 hover:bg-blue-700"><Calendar className="mr-2 h-4 w-4" /> Book Appointment</Button><Separator className="my-4" /><p className="text-sm text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4" /> +91 1800-123-456</p></CardContent></Card></div></div></div></section></>);
  }
  return (<><section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4">Our Specialities</Badge><h1 className="text-4xl font-bold text-white mb-4">Departments of Excellence</h1></div></section>
    <section className="py-16"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{(departments || []).map((dept, i) => { const IconComp = DEPT_ICONS[dept.icon] || Stethoscope; return (<Card key={dept.id} className="hover:shadow-lg transition-all cursor-pointer group border-0 shadow-sm hover:-translate-y-1" onClick={() => setActiveDept(dept)}><CardContent className="p-6"><div className="flex items-start gap-4"><div className={`w-14 h-14 ${COLORS[i % COLORS.length]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}><IconComp className="h-7 w-7 text-white" /></div><div><h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600">{dept.name}</h3><p className="text-gray-600 text-sm line-clamp-2">{dept.description}</p><span className="text-blue-600 text-sm font-medium mt-2 inline-flex items-center gap-1">Learn more <ChevronRight className="h-3 w-3" /></span></div></div></CardContent></Card>); })}</div></div></section></>);
}

// ============== DOCTORS PAGE ==============
function DoctorsPage({ doctors, departments, navigate }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = (doctors || []).filter(d => (filter === 'all' || d.department === filter) && (!search || d.name.toLowerCase().includes(search.toLowerCase()) || d.department.toLowerCase().includes(search.toLowerCase())));

  return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4">Our Doctors</Badge><h1 className="text-4xl font-bold text-white mb-4">Meet Our Specialists</h1></div></section>
    <section className="py-8 bg-gray-50 border-b"><div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Search doctors..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} /></div>
      <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All Departments</SelectItem>{(departments || []).map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select>
    </div></section>
    <section className="py-12"><div className="container mx-auto px-4">{filtered.length === 0 ? <div className="text-center py-12"><Users className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No doctors found.</p></div> : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filtered.map((doc, i) => (
        <Card key={doc.id} className="hover:shadow-lg transition-all cursor-pointer group border-0 shadow-sm" onClick={() => navigate('doctor-detail', { doctor: doc })}><CardContent className="p-6"><div className="flex items-start gap-4">
          <Avatar className="w-16 h-16"><AvatarFallback className={`${COLORS[i % COLORS.length]} text-white text-lg font-bold`}>{getInitials(doc.name)}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 group-hover:text-blue-600 truncate">{doc.name}</h3><p className="text-blue-600 text-sm font-medium">{doc.department}</p><p className="text-gray-500 text-xs mt-1 truncate">{doc.qualification}</p><div className="flex items-center gap-3 mt-2"><div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" /><span className="text-sm font-semibold">{doc.rating}</span></div><Badge variant="secondary" className="text-xs">{doc.experience}yr</Badge></div></div>
        </div></CardContent></Card>
      ))}</div>
    )}</div></section>
  </>);
}

// ============== DOCTOR DETAIL ==============
function DoctorDetailPage({ doctor, navigate }) {
  if (!doctor) return null;
  return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4">
      <button onClick={() => navigate('doctors')} className="text-blue-200 hover:text-white text-sm mb-4 flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> All Doctors</button>
      <div className="flex items-center gap-6"><Avatar className="w-24 h-24 ring-4 ring-white/20"><AvatarFallback className="bg-blue-500 text-white text-2xl font-bold">{getInitials(doctor.name)}</AvatarFallback></Avatar><div><h1 className="text-3xl font-bold text-white">{doctor.name}</h1><p className="text-blue-200 text-lg">{doctor.department}</p><p className="text-blue-300 text-sm">{doctor.qualification}</p></div></div>
    </div></section>
    <section className="py-12"><div className="container mx-auto px-4"><div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div><h2 className="text-xl font-bold mb-3">About</h2><p className="text-gray-600 leading-relaxed">{doctor.bio}</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{doctor.experience}</p><p className="text-xs text-gray-500">Years Exp.</p></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><div className="flex items-center justify-center gap-1"><Star className="h-4 w-4 text-yellow-400" fill="currentColor" /><span className="text-2xl font-bold">{doctor.rating}</span></div><p className="text-xs text-gray-500">Rating</p></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{doctor.reviews}</p><p className="text-xs text-gray-500">Reviews</p></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-teal-600">&#8377;{doctor.consultationFee}</p><p className="text-xs text-gray-500">Fee</p></CardContent></Card>
        </div>
        <div><h2 className="text-xl font-bold mb-3">Availability</h2><div className="flex flex-wrap gap-2">{(doctor.availability?.days || []).map(d => <Badge key={d} variant="outline" className="text-blue-600 border-blue-200 px-3 py-1">{d}</Badge>)}</div></div>
      </div>
      <div><Card className="border-0 shadow-md sticky top-24"><CardContent className="p-6"><h3 className="font-bold mb-4">Book Appointment</h3><Button onClick={() => navigate('appointment', { preselectedDoctor: doctor })} className="w-full bg-blue-600 hover:bg-blue-700"><Calendar className="mr-2 h-4 w-4" /> Book Now</Button><Separator className="my-4" /><p className="text-sm text-gray-500 flex items-center gap-2"><Clock className="h-4 w-4" /> 30 min consultation</p></CardContent></Card></div>
    </div></div></section>
  </>);
}

// ============== APPOINTMENT PAGE ==============
function AppointmentPage({ departments, doctors, preselectedDoctor }) {
  const [form, setForm] = useState({ patientName: '', phone: '', email: '', departmentId: preselectedDoctor?.departmentId || '', doctorId: preselectedDoctor?.id || '', date: '', timeSlot: '', notes: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [appointmentData, setAppointmentData] = useState(null);
  const filteredDoctors = (doctors || []).filter(d => !form.departmentId || d.departmentId === form.departmentId);
  const selectedDoctor = (doctors || []).find(d => d.id === form.doctorId);
  const selectedDept = (departments || []).find(d => d.id === form.departmentId);

  useEffect(() => {
    if (form.doctorId && form.date) {
      fetch(`/api/booked-slots?doctorId=${form.doctorId}&date=${form.date}`).then(r => r.json()).then(d => setBookedSlots(d.bookedSlots || [])).catch(() => setBookedSlots([]));
    }
  }, [form.doctorId, form.date]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, doctorName: selectedDoctor?.name || '', department: selectedDept?.name || selectedDoctor?.department || '' }) });
      const data = await res.json();
      if (res.ok) { setSuccess(true); setAppointmentData(data.appointment); toast.success('Appointment booked!'); }
      else toast.error(data.error || 'Failed');
    } catch { toast.error('Something went wrong'); }
    setLoading(false);
  };

  const getMinDate = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; };

  if (success) return (
    <section className="py-20"><div className="container mx-auto px-4 max-w-lg text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-green-600" /></div>
      <h2 className="text-3xl font-bold mb-4">Appointment Confirmed!</h2>
      {appointmentData && <Card className="border-0 shadow-md mb-6 text-left"><CardContent className="p-6 space-y-3">
        <div className="flex justify-between"><span className="text-gray-500">Patient:</span><span className="font-medium">{appointmentData.patientName}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Doctor:</span><span className="font-medium">{appointmentData.doctorName}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-medium">{appointmentData.date}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Time:</span><span className="font-medium">{appointmentData.timeSlot}</span></div>
        <Separator /><div className="flex justify-between"><span className="text-gray-500">Status:</span><Badge className="bg-green-100 text-green-700">Confirmed</Badge></div>
      </CardContent></Card>}
      <Button onClick={() => { setSuccess(false); setStep(1); setForm({ patientName: '', phone: '', email: '', departmentId: '', doctorId: '', date: '', timeSlot: '', notes: '' }); }} variant="outline">Book Another</Button>
    </div></section>
  );

  return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4">Appointment</Badge><h1 className="text-4xl font-bold text-white mb-4">Book an Appointment</h1></div></section>
    <section className="py-12"><div className="container mx-auto px-4 max-w-3xl">
      <div className="flex items-center justify-center gap-2 mb-10">{[1,2,3].map(s => (<div key={s} className="flex items-center gap-2"><div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div><span className={`text-sm hidden sm:inline ${step >= s ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{s === 1 ? 'Doctor' : s === 2 ? 'Slot' : 'Details'}</span>{s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}</div>))}</div>

      {step === 1 && <Card className="border-0 shadow-md"><CardHeader><CardTitle>Select Department & Doctor</CardTitle></CardHeader><CardContent className="space-y-6">
        <div className="space-y-2"><Label>Department</Label><Select value={form.departmentId} onValueChange={v => setForm(f => ({ ...f, departmentId: v, doctorId: '' }))}><SelectTrigger><SelectValue placeholder="Choose department" /></SelectTrigger><SelectContent>{(departments || []).map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label>Doctor</Label>{filteredDoctors.length === 0 ? <p className="text-gray-500 text-sm">Select a department first</p> : <div className="grid gap-3">{filteredDoctors.map(doc => (
          <div key={doc.id} onClick={() => setForm(f => ({ ...f, doctorId: doc.id }))} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${form.doctorId === doc.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <Avatar className="w-12 h-12"><AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{getInitials(doc.name)}</AvatarFallback></Avatar>
            <div className="flex-1"><p className="font-semibold">{doc.name}</p><p className="text-sm text-gray-500">{doc.qualification} | {doc.experience}yr</p></div>
            <div className="text-right"><div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" /><span className="text-sm font-medium">{doc.rating}</span></div><p className="text-sm text-gray-500">&#8377;{doc.consultationFee}</p></div>
          </div>))}</div>}
        </div>
        <Button onClick={() => setStep(2)} disabled={!form.doctorId} className="w-full bg-blue-600 hover:bg-blue-700">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>
      </CardContent></Card>}

      {step === 2 && selectedDoctor && <Card className="border-0 shadow-md"><CardHeader><CardTitle>Choose Date & Time</CardTitle><CardDescription>{selectedDoctor.name}'s available slots</CardDescription></CardHeader><CardContent className="space-y-6">
        <div className="space-y-2"><Label>Date</Label><Input type="date" min={getMinDate()} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value, timeSlot: '' }))} />
          {form.date && selectedDoctor.availability?.days && (() => { const dayName = new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }); if (!selectedDoctor.availability.days.includes(dayName)) return <p className="text-red-500 text-sm">Not available on {dayName}s. Available: {selectedDoctor.availability.days.join(', ')}</p>; return null; })()}
        </div>
        {form.date && (() => { const dayName = new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }); if (!selectedDoctor.availability?.days?.includes(dayName)) return null; return (
          <div className="space-y-2"><Label>Time Slot</Label><div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{(selectedDoctor.availability?.slots || []).map(slot => { const isBooked = bookedSlots.includes(slot); return (<button key={slot} disabled={isBooked} onClick={() => setForm(f => ({ ...f, timeSlot: slot }))} className={`p-2.5 rounded-lg text-sm font-medium border-2 transition ${isBooked ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through' : form.timeSlot === slot ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>{slot}</button>); })}</div></div>
        ); })()}
        <div className="flex gap-3"><Button onClick={() => setStep(1)} variant="outline" className="flex-1">Back</Button><Button onClick={() => setStep(3)} disabled={!form.date || !form.timeSlot} className="flex-1 bg-blue-600 hover:bg-blue-700">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button></div>
      </CardContent></Card>}

      {step === 3 && <Card className="border-0 shadow-md"><CardHeader><CardTitle>Your Details</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3"><Avatar><AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{getInitials(selectedDoctor?.name)}</AvatarFallback></Avatar><div><p className="font-semibold">{selectedDoctor?.name}</p><p className="text-sm text-gray-600">{form.date} at {form.timeSlot}</p></div></div>
        <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Your full name" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Phone *</Label><Input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div><div className="space-y-2"><Label>Email *</Label><Input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div></div>
        <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Any concerns..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
        <div className="flex gap-3"><Button onClick={() => setStep(2)} variant="outline" className="flex-1">Back</Button><Button onClick={handleSubmit} disabled={loading || !form.patientName || !form.phone || !form.email} className="flex-1 bg-blue-600 hover:bg-blue-700">{loading ? 'Booking...' : 'Confirm Booking'}</Button></div>
      </CardContent></Card>}
    </div></section>
  </>);
}

// ============== CONTACT PAGE ==============
function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); const data = await res.json(); if (res.ok) { setSent(true); toast.success(data.message); } else toast.error(data.error); } catch { toast.error('Failed'); } setLoading(false); };

  return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4">Contact</Badge><h1 className="text-4xl font-bold text-white mb-4">Get In Touch</h1></div></section>
    <section className="py-16"><div className="container mx-auto px-4"><div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">{sent ? <Card className="border-0 shadow-md"><CardContent className="p-12 text-center"><CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">Message Sent!</h3><p className="text-gray-600 mb-4">We'll get back to you within 24 hours.</p><Button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} variant="outline">Send Another</Button></CardContent></Card> : (
        <Card className="border-0 shadow-md"><CardHeader><CardTitle>Send us a Message</CardTitle></CardHeader><CardContent><form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Name *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div><div className="space-y-2"><Label>Email *</Label><Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div><div className="space-y-2"><Label>Subject</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div></div>
          <div className="space-y-2"><Label>Message *</Label><Textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} /></div>
          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">{loading ? 'Sending...' : 'Send Message'} <Send className="ml-2 h-4 w-4" /></Button>
        </form></CardContent></Card>
      )}</div>
      <div className="space-y-6">
        {[{ icon: MapPin, title: 'Address', text: 'MedCare Hospital, Saket, New Delhi - 110017' },{ icon: Phone, title: 'Phone', text: '+91 1800-123-456\n+91 11-2956-7890' },{ icon: Mail, title: 'Email', text: 'info@medcare.com' },{ icon: Clock, title: 'Hours', text: 'Mon-Sat: 8AM-8PM\nEmergency: 24/7' }].map((item, i) => (
          <Card key={i} className="border-0 shadow-sm"><CardContent className="p-4 flex items-start gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><item.icon className="h-5 w-5 text-blue-600" /></div><div><h4 className="font-semibold text-sm">{item.title}</h4><p className="text-gray-600 text-sm whitespace-pre-line">{item.text}</p></div></CardContent></Card>
        ))}
        <div className="rounded-xl overflow-hidden shadow-sm"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.0!2d77.2167!3d28.5245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMxJzI4LjIiTiA3N8KwMTMnMDAuMSJF!5e0!3m2!1sen!2sin!4v1" width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy" title="Location" /></div>
      </div>
    </div></div></section>
  </>);
}

// ============== SERVICES PAGE ==============
function ServicesPage() {
  return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4">Services</Badge><h1 className="text-4xl font-bold text-white mb-4">Services & Facilities</h1></div></section>
    <section className="py-16"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{SERVICES_LIST.map((s, i) => (
      <Card key={i} className="hover:shadow-lg transition-all border-0 shadow-sm group hover:-translate-y-1"><CardContent className="p-6"><div className={`w-14 h-14 ${COLORS[i % COLORS.length]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><s.icon className="h-7 w-7 text-white" /></div><h3 className="font-bold text-lg mb-2">{s.name}</h3><p className="text-gray-600 text-sm">{s.desc}</p></CardContent></Card>
    ))}</div></div></section>
  </>);
}

// ============== EMERGENCY PAGE ==============
function EmergencyPage() {
  return (<>
    <section className="bg-gradient-to-r from-red-700 to-red-600 py-16"><div className="container mx-auto px-4 flex items-center gap-4"><div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Ambulance className="h-8 w-8 text-white" /></div><div><h1 className="text-4xl font-bold text-white">Emergency Services</h1><p className="text-red-100 text-lg">Available 24/7</p></div></div></section>
    <section className="py-12"><div className="container mx-auto px-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-12 text-center"><AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" /><h2 className="text-2xl font-bold text-red-800 mb-4">In Case of Emergency</h2><div className="flex flex-wrap justify-center gap-4"><a href="tel:108" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-red-700"><Phone className="h-6 w-6" /> Call 108</a><a href="tel:+911800123456" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-700"><Phone className="h-6 w-6" /> +91 1800-123-456</a></div></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[{ title: 'Trauma Center', desc: 'Fully equipped 24/7 trauma center.', icon: Activity },{ title: 'Ambulance Fleet', desc: 'Advanced ambulances, 15 min response.', icon: Truck },{ title: 'Emergency ICU', desc: '50-bed ICU with advanced monitoring.', icon: MonitorCheck },{ title: 'Blood Bank', desc: 'Round-the-clock blood supply.', icon: Droplets },{ title: 'Emergency Surgery', desc: 'Dedicated emergency operation theaters.', icon: Scissors },{ title: 'Cardiac Emergency', desc: 'Specialized cardiac emergency unit.', icon: Heart }].map((item, i) => (
        <Card key={i} className="border-0 shadow-sm"><CardContent className="p-6"><div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4"><item.icon className="h-6 w-6 text-red-600" /></div><h3 className="font-bold mb-2">{item.title}</h3><p className="text-gray-600 text-sm">{item.desc}</p></CardContent></Card>
      ))}</div>
    </div></section>
  </>);
}

// ============== BLOG PAGE ==============
function BlogPage({ blogs, navigate }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  if (selectedBlog) return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><button onClick={() => setSelectedBlog(null)} className="text-blue-200 hover:text-white text-sm mb-4 flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> All Articles</button><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-3">{selectedBlog.category}</Badge><h1 className="text-3xl font-bold text-white mb-4">{selectedBlog.title}</h1><div className="flex items-center gap-4 text-blue-200 text-sm"><span><User className="h-4 w-4 inline" /> {selectedBlog.author}</span><span><Calendar className="h-4 w-4 inline" /> {selectedBlog.date}</span><span><Clock className="h-4 w-4 inline" /> {selectedBlog.readTime} read</span></div></div></section>
    <section className="py-12"><div className="container mx-auto px-4 max-w-3xl">{selectedBlog.content?.split('\n\n').map((p, i) => <p key={i} className="text-gray-600 leading-relaxed mb-4">{p}</p>)}</div></section>
  </>);
  return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-16"><div className="container mx-auto px-4"><Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 mb-4">Blog</Badge><h1 className="text-4xl font-bold text-white mb-4">Health Articles & Tips</h1></div></section>
    <section className="py-12"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{(blogs || []).map(blog => (
      <Card key={blog.id} className="hover:shadow-lg transition-all cursor-pointer group border-0 shadow-sm overflow-hidden" onClick={() => setSelectedBlog(blog)}><div className="h-2 bg-blue-600" /><CardContent className="p-6"><Badge variant="secondary" className="mb-3 text-xs">{blog.category}</Badge><h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 line-clamp-2">{blog.title}</h3><p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.excerpt}</p><div className="flex items-center justify-between text-sm text-gray-500"><span><User className="h-3.5 w-3.5 inline" /> {blog.author}</span><span><Clock className="h-3.5 w-3.5 inline" /> {blog.readTime}</span></div></CardContent></Card>
    ))}</div></div></section>
  </>);
}

// ============== AUTH PAGE ==============
function AuthPage({ onLogin, navigate }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { const res = await fetch(tab === 'login' ? '/api/auth/login' : '/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tab === 'login' ? { email: form.email, password: form.password } : form) }); const data = await res.json(); if (res.ok) { toast.success(data.message); onLogin(data.user, data.token); navigate('home'); } else toast.error(data.error); } catch { toast.error('Something went wrong'); } setLoading(false); };

  return (<section className="py-20 bg-gray-50 min-h-[70vh]"><div className="container mx-auto px-4 max-w-md">
    <Card className="border-0 shadow-lg"><CardHeader className="text-center"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><User className="h-8 w-8 text-blue-600" /></div><CardTitle className="text-2xl">Welcome to MedCare</CardTitle><CardDescription>Sign in to manage your appointments</CardDescription></CardHeader>
    <CardContent><TabsTrigger value="login">Login</TabsTrigger>
      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === 'register' && <div className="space-y-2"><Label>Full Name</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>}
        <div className="space-y-2"><Label>Email</Label><Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
        {tab === 'register' && <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>}
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">{loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}</Button>
      </form></Tabs>
      {tab === 'login' && <p className="text-center text-xs text-gray-500 mt-4"></p>}
    </CardContent></Card>
  </div></section>);
}

// ============== ADMIN DASHBOARD ==============
function AdminDashboard({ navigate }) {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, apptRes, contactRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/appointments').then(r => r.json()),
        fetch('/api/admin/contacts').then(r => r.json()),
      ]);
      setStats(statsRes.stats);
      setAppointments(apptRes.appointments || []);
      setContacts(contactRes.queries || []);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const updateStatus = async (id, status) => {
    try { const res = await fetch(`/api/appointments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); if (res.ok) { toast.success('Updated'); loadData(); } } catch { toast.error('Failed'); }
  };

  const deleteAppt = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try { const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' }); if (res.ok) { toast.success('Deleted'); loadData(); } } catch { toast.error('Failed'); }
  };

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try { const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' }); if (res.ok) { toast.success('Deleted'); loadData(); } } catch { toast.error('Failed'); }
  };

  const statusColor = (s) => s === 'confirmed' ? 'bg-blue-100 text-blue-700' : s === 'completed' ? 'bg-green-100 text-green-700' : s === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';

  if (loading) return <div className="py-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" /></div>;

  return (<>
    <section className="bg-gradient-to-r from-blue-900 to-blue-700 py-12"><div className="container mx-auto px-4"><h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1><p className="text-blue-200">Manage hospital operations</p></div></section>
    <section className="py-8"><div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[{ label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: CalendarDays, color: 'bg-blue-500' },{ label: 'Confirmed', value: stats?.confirmedAppointments || 0, icon: CheckCircle, color: 'bg-green-500' },{ label: 'Cancelled', value: stats?.cancelledAppointments || 0, icon: XCircle, color: 'bg-red-500' },{ label: 'New Leads', value: stats?.newContacts || 0, icon: MessageSquare, color: 'bg-purple-500' }].map((item, i) => (
          <Card key={i} className="border-0 shadow-sm"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-500">{item.label}</span><div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}><item.icon className="h-4 w-4 text-white" /></div></div><p className="text-2xl font-bold">{item.value}</p></CardContent></Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6"><TabsTrigger value="overview">Appointments</TabsTrigger><TabsTrigger value="contacts">Leads / Contact Messages</TabsTrigger></TabsList>

        <TabsContent value="overview"><Card className="border-0 shadow-sm"><CardHeader><CardTitle className="text-lg">All Appointments ({appointments.length})</CardTitle></CardHeader><CardContent>
          {appointments.length === 0 ? <p className="text-gray-500 text-center py-8">No appointments yet</p> : (
            <div className="space-y-3">{appointments.map(appt => (
              <div key={appt.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><p className="font-semibold text-gray-900">{appt.patientName}</p><Badge className={statusColor(appt.status)}>{appt.status}</Badge></div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      {appt.phone && <a href={`tel:${appt.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline font-medium"><PhoneCall className="h-3.5 w-3.5" /> {appt.phone}</a>}
                      {appt.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {appt.email}</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{appt.doctorName} | {appt.department} | {appt.date} at {appt.timeSlot}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {appt.status === 'confirmed' && <><Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateStatus(appt.id, 'completed')}>Complete</Button><Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus(appt.id, 'cancelled')}>Cancel</Button></>}
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteAppt(appt.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}</div>
          )}
        </CardContent></Card></TabsContent>

        <TabsContent value="contacts"><Card className="border-0 shadow-sm"><CardHeader><CardTitle className="text-lg">All Leads / Contact Messages ({contacts.length})</CardTitle></CardHeader><CardContent>
          {contacts.length === 0 ? <p className="text-gray-500 text-center py-8">No messages yet</p> : (
            <div className="space-y-3">{contacts.map(q => (
              <div key={q.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{q.name}</p>
                      <Badge variant="secondary" className="text-xs">{q.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-2">
                      {q.phone && <a href={`tel:${q.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"><PhoneCall className="h-4 w-4" /> {q.phone}</a>}
                      {q.email && <a href={`mailto:${q.email}`} className="flex items-center gap-1 text-gray-600 hover:underline"><Mail className="h-3.5 w-3.5" /> {q.email}</a>}
                    </div>
                    {q.subject && <p className="text-sm font-medium text-gray-700 mb-1">{q.subject}</p>}
                    <p className="text-sm text-gray-600">{q.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{q.createdAt ? new Date(q.createdAt).toLocaleString() : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {q.phone && <a href={`tel:${q.phone}`}><Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 gap-1"><PhoneCall className="h-3.5 w-3.5" /> Call</Button></a>}
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteLead(q.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}</div>
          )}
        </CardContent></Card></TabsContent>
      </Tabs>
    </div></section>
  </>);
}

// ============== MAIN APP ==============
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [preselectedDoctor, setPreselectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupSQL, setSetupSQL] = useState('');

  const navigate = useCallback((page, data) => {
    setCurrentPage(page);
    if (data?.doctor) setSelectedDoctor(data.doctor);
    if (data?.department) setSelectedDepartment(data.department);
    if (data?.preselectedDoctor) setPreselectedDoctor(data.preselectedDoctor);
    else if (page !== 'appointment') setPreselectedDoctor(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const initApp = useCallback(async () => {
    try {
      const seedRes = await fetch('/api/seed');
      const seedData = await seedRes.json();

      if (seedData.needsSetup) {
        setNeedsSetup(true);
        setSetupSQL(seedData.sql);
        setLoading(false);
        return;
      }

      const [deptRes, docRes, blogRes] = await Promise.all([
        fetch('/api/departments').then(r => r.json()),
        fetch('/api/doctors').then(r => r.json()),
        fetch('/api/blogs').then(r => r.json()),
      ]);
      setDepartments(deptRes.departments || []);
      setDoctors(docRes.doctors || []);
      setBlogs(blogRes.blogs || []);
      setNeedsSetup(false);
    } catch (err) {
      console.error('Init failed:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('medcare_user') : null;
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('medcare_token') : null;
    if (savedUser && savedToken) { try { setUser(JSON.parse(savedUser)); setToken(savedToken); } catch {} }
    initApp();
  }, [initApp]);

  const handleLogin = (userData, tokenData) => { setUser(userData); setToken(tokenData); localStorage.setItem('medcare_user', JSON.stringify(userData)); localStorage.setItem('medcare_token', tokenData); };
  const handleLogout = () => { setUser(null); setToken(null); localStorage.removeItem('medcare_user'); localStorage.removeItem('medcare_token'); toast.success('Logged out'); navigate('home'); };

  if (loading) return (<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"><Heart className="h-8 w-8 text-white" fill="white" /></div><h2 className="text-xl font-bold">MedCare Hospital</h2><p className="text-gray-500 text-sm mt-1">Loading...</p></div></div>);

  if (needsSetup) return <SetupPage sql={setupSQL} onRetry={() => { setLoading(true); initApp(); }} />;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header currentPage={currentPage} navigate={navigate} user={user} onLogout={handleLogout} />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage departments={departments} doctors={doctors} navigate={navigate} />}
        {currentPage === 'about' && <AboutPage navigate={navigate} />}
        {currentPage === 'specialities' && <SpecialitiesPage departments={departments} navigate={navigate} selectedDepartment={selectedDepartment} />}
        {currentPage === 'doctors' && <DoctorsPage doctors={doctors} departments={departments} navigate={navigate} />}
        {currentPage === 'doctor-detail' && <DoctorDetailPage doctor={selectedDoctor} navigate={navigate} />}
        {currentPage === 'appointment' && <AppointmentPage departments={departments} doctors={doctors} preselectedDoctor={preselectedDoctor} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'emergency' && <EmergencyPage />}
        {currentPage === 'blog' && <BlogPage blogs={blogs} navigate={navigate} />}
        {currentPage === 'auth' && <AuthPage onLogin={handleLogin} navigate={navigate} />}
        {currentPage === 'admin' && <AdminDashboard navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
