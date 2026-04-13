import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// ============== SUPABASE CLIENT ==============
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============== HELPERS ==============
function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

function hashPw(pw) {
  return crypto.createHash('sha256').update(pw + '_medcare_salt_2025').digest('hex');
}

function makeToken(user) {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, ts: Date.now() })).toString('base64');
}

// Convert snake_case DB row to camelCase for frontend
function toCamel(row) {
  if (!row || typeof row !== 'object') return row;
  if (Array.isArray(row)) return row.map(toCamel);
  const result = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

// Convert camelCase request body to snake_case for DB
function toSnake(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnake);
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

// ============== TABLE CREATION SQL ==============
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  services JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  department_id TEXT,
  department TEXT,
  qualification TEXT,
  experience INTEGER DEFAULT 0,
  bio TEXT,
  gender TEXT,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  availability JSONB DEFAULT '{}'::jsonb,
  consultation_fee INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  department_id TEXT,
  doctor_id TEXT,
  doctor_name TEXT,
  department TEXT,
  date TEXT,
  time_slot TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  category TEXT,
  author TEXT,
  excerpt TEXT,
  content TEXT,
  date TEXT,
  read_time TEXT,
  featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS contact_queries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_department ON doctors(department);
CREATE INDEX IF NOT EXISTS idx_doctors_featured ON doctors(featured);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_contact_queries_status ON contact_queries(status);
`;

// ============== AUTO TABLE CREATION ==============
async function tryCreateTables() {
  // Try Supabase internal pg-meta endpoint
  try {
    const statements = CREATE_TABLES_SQL.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'X-Supabase-Api-Surcharge': 'true',
        },
        body: JSON.stringify({ query: stmt }),
      });
    }
  } catch (e) {
    console.log('RPC table creation attempt failed (expected):', e.message);
  }
}

async function checkTablesExist() {
  const { data, error } = await supabase.from('departments').select('id').limit(1);
  return !error;
}

// ============== SEED DATA ==============
function buildSeedData() {
  const deptIds = Array.from({ length: 10 }, () => uuidv4());

  const departments = [
    { id: deptIds[0], name: 'Cardiology', slug: 'cardiology', icon: 'Heart', description: 'Comprehensive cardiac care including diagnostics, interventional procedures, and cardiac rehabilitation. Our state-of-the-art catheterization lab ensures the best outcomes for heart patients.', services: ['ECG & Echocardiography', 'Coronary Angiography', 'Angioplasty & Stenting', 'Bypass Surgery (CABG)', 'Pacemaker Implantation', 'Heart Failure Management'] },
    { id: deptIds[1], name: 'Neurology', slug: 'neurology', icon: 'Brain', description: 'Expert neurological care for disorders of the brain, spinal cord, and nervous system. Advanced diagnostic facilities including EEG, EMG, and neuroimaging.', services: ['Stroke Management', 'Epilepsy Treatment', 'Movement Disorders', 'Headache Clinic', 'Neuromuscular Disorders', 'Brain Tumor Treatment'] },
    { id: deptIds[2], name: 'Orthopedics', slug: 'orthopedics', icon: 'Bone', description: 'Complete musculoskeletal care from joint replacements to sports injuries. Minimally invasive surgical techniques for faster recovery.', services: ['Joint Replacement Surgery', 'Arthroscopy', 'Spine Surgery', 'Sports Medicine', 'Fracture Management', 'Physiotherapy & Rehab'] },
    { id: deptIds[3], name: 'Pediatrics', slug: 'pediatrics', icon: 'Baby', description: 'Compassionate healthcare for infants, children, and adolescents. Our pediatric specialists provide comprehensive care in a child-friendly environment.', services: ['Newborn Care (NICU)', 'Vaccination Programs', 'Growth & Development', 'Pediatric Surgery', 'Child Nutrition', 'Adolescent Health'] },
    { id: deptIds[4], name: 'Oncology', slug: 'oncology', icon: 'Shield', description: 'Multidisciplinary cancer care with the latest treatment protocols. Comprehensive services from diagnosis through treatment and survivorship.', services: ['Chemotherapy', 'Radiation Therapy', 'Surgical Oncology', 'Immunotherapy', 'Palliative Care', 'Cancer Screening'] },
    { id: deptIds[5], name: 'Dermatology', slug: 'dermatology', icon: 'Sparkles', description: 'Expert skin care for all conditions from common dermatological issues to complex skin disorders. Advanced cosmetic dermatology services available.', services: ['Skin Disease Treatment', 'Cosmetic Dermatology', 'Laser Treatment', 'Hair Loss Treatment', 'Allergy Testing', 'Skin Cancer Screening'] },
    { id: deptIds[6], name: 'Ophthalmology', slug: 'ophthalmology', icon: 'Eye', description: 'Complete eye care from routine check-ups to complex surgeries. State-of-the-art diagnostic and surgical equipment for optimal vision outcomes.', services: ['Cataract Surgery', 'LASIK & Refractive Surgery', 'Glaucoma Treatment', 'Retina Surgery', 'Pediatric Ophthalmology', 'Cornea Transplant'] },
    { id: deptIds[7], name: 'ENT', slug: 'ent', icon: 'Ear', description: 'Comprehensive ear, nose, and throat care including advanced surgical interventions. Expert management of hearing disorders, sinus conditions, and throat ailments.', services: ['Hearing Assessment', 'Sinus Surgery', 'Tonsillectomy', 'Cochlear Implant', 'Voice Disorders', 'Sleep Apnea Treatment'] },
    { id: deptIds[8], name: 'General Surgery', slug: 'general-surgery', icon: 'Scissors', description: 'Expert surgical care using minimally invasive techniques. Our experienced surgeons perform a wide range of procedures with excellent outcomes.', services: ['Laparoscopic Surgery', 'Hernia Repair', 'Gallbladder Surgery', 'Appendectomy', 'Thyroid Surgery', 'Breast Surgery'] },
    { id: deptIds[9], name: 'Internal Medicine', slug: 'internal-medicine', icon: 'Stethoscope', description: 'Comprehensive adult healthcare focusing on prevention, diagnosis, and treatment of internal diseases. Expert management of chronic conditions.', services: ['Diabetes Management', 'Hypertension Control', 'Infectious Diseases', 'Respiratory Medicine', 'Gastroenterology', 'Health Check-ups'] },
  ];

  const doctors = [
    { id: uuidv4(), name: 'Dr. Rajesh Sharma', slug: 'dr-rajesh-sharma', department_id: deptIds[0], department: 'Cardiology', qualification: 'MBBS, MD (Cardiology), DM', experience: 20, bio: 'Dr. Rajesh Sharma is one of the most experienced interventional cardiologists in Delhi NCR with over 20 years of expertise. He has performed more than 5,000 cardiac procedures including complex angioplasties and bypass surgeries.', gender: 'male', rating: 4.9, reviews: 312, featured: true, availability: { days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'] }, consultation_fee: 1500 },
    { id: uuidv4(), name: 'Dr. Priya Patel', slug: 'dr-priya-patel', department_id: deptIds[1], department: 'Neurology', qualification: 'MBBS, MD (Neurology), DM, Fellowship (UK)', experience: 15, bio: 'Dr. Priya Patel is a renowned neurologist specializing in stroke management and epilepsy treatment. She completed her fellowship from the Royal College of Physicians, London.', gender: 'female', rating: 4.8, reviews: 245, featured: true, availability: { days: ['Monday', 'Tuesday', 'Thursday', 'Saturday'], slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] }, consultation_fee: 1200 },
    { id: uuidv4(), name: 'Dr. Amit Kumar', slug: 'dr-amit-kumar', department_id: deptIds[2], department: 'Orthopedics', qualification: 'MBBS, MS (Orthopedics), MCh', experience: 18, bio: 'Dr. Amit Kumar is a leading orthopedic surgeon known for his expertise in joint replacement surgeries. He has successfully performed over 3,000 knee and hip replacement procedures.', gender: 'male', rating: 4.7, reviews: 198, featured: true, availability: { days: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'], slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '03:00 PM', '03:30 PM', '04:00 PM'] }, consultation_fee: 1300 },
    { id: uuidv4(), name: 'Dr. Sunita Reddy', slug: 'dr-sunita-reddy', department_id: deptIds[3], department: 'Pediatrics', qualification: 'MBBS, MD (Pediatrics), Fellowship (AIIMS)', experience: 12, bio: 'Dr. Sunita Reddy is a compassionate pediatrician dedicated to child health and development. She has special expertise in neonatal care and childhood developmental disorders.', gender: 'female', rating: 4.9, reviews: 287, featured: false, availability: { days: ['Monday', 'Wednesday', 'Thursday', 'Friday'], slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM'] }, consultation_fee: 1000 },
    { id: uuidv4(), name: 'Dr. Vikram Singh', slug: 'dr-vikram-singh', department_id: deptIds[4], department: 'Oncology', qualification: 'MBBS, MD (Oncology), DM, Fellowship (USA)', experience: 22, bio: 'Dr. Vikram Singh is a distinguished oncologist with over two decades of experience in cancer treatment. He specializes in immunotherapy and personalized cancer treatment protocols.', gender: 'male', rating: 4.8, reviews: 176, featured: false, availability: { days: ['Monday', 'Tuesday', 'Thursday'], slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'] }, consultation_fee: 2000 },
    { id: uuidv4(), name: 'Dr. Ananya Gupta', slug: 'dr-ananya-gupta', department_id: deptIds[5], department: 'Dermatology', qualification: 'MBBS, MD (Dermatology), FAAD', experience: 10, bio: 'Dr. Ananya Gupta is a skilled dermatologist specializing in both clinical and cosmetic dermatology. She is known for her expertise in laser treatments and skin rejuvenation procedures.', gender: 'female', rating: 4.6, reviews: 210, featured: false, availability: { days: ['Monday', 'Wednesday', 'Friday', 'Saturday'], slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] }, consultation_fee: 800 },
    { id: uuidv4(), name: 'Dr. Sanjay Mehta', slug: 'dr-sanjay-mehta', department_id: deptIds[6], department: 'Ophthalmology', qualification: 'MBBS, MS (Ophthalmology), Fellowship (Germany)', experience: 16, bio: 'Dr. Sanjay Mehta is an expert ophthalmologist specializing in cataract and refractive surgeries. He has performed over 10,000 successful eye surgeries using the latest technology.', gender: 'male', rating: 4.7, reviews: 234, featured: false, availability: { days: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'], slots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM'] }, consultation_fee: 1100 },
    { id: uuidv4(), name: 'Dr. Meera Joshi', slug: 'dr-meera-joshi', department_id: deptIds[7], department: 'ENT', qualification: 'MBBS, MS (ENT), DNB', experience: 14, bio: 'Dr. Meera Joshi is a highly regarded ENT specialist with expertise in endoscopic sinus surgery and hearing restoration procedures.', gender: 'female', rating: 4.8, reviews: 167, featured: false, availability: { days: ['Monday', 'Tuesday', 'Friday', 'Saturday'], slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '03:00 PM', '03:30 PM', '04:00 PM'] }, consultation_fee: 900 },
    { id: uuidv4(), name: 'Dr. Ravi Krishnan', slug: 'dr-ravi-krishnan', department_id: deptIds[8], department: 'General Surgery', qualification: 'MBBS, MS (Surgery), FRCS', experience: 25, bio: 'Dr. Ravi Krishnan is a veteran surgeon with 25 years of surgical experience. He pioneered minimally invasive surgical techniques at MedCare and has trained numerous surgeons.', gender: 'male', rating: 4.9, reviews: 289, featured: true, availability: { days: ['Monday', 'Wednesday', 'Thursday', 'Friday'], slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'] }, consultation_fee: 1400 },
    { id: uuidv4(), name: 'Dr. Deepa Nair', slug: 'dr-deepa-nair', department_id: deptIds[9], department: 'Internal Medicine', qualification: 'MBBS, MD (Internal Medicine), FICP', experience: 13, bio: 'Dr. Deepa Nair is an accomplished internist specializing in diabetes management and preventive healthcare.', gender: 'female', rating: 4.7, reviews: 198, featured: false, availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] }, consultation_fee: 800 },
    { id: uuidv4(), name: 'Dr. Arjun Malhotra', slug: 'dr-arjun-malhotra', department_id: deptIds[0], department: 'Cardiology', qualification: 'MBBS, MD, DM (Cardiology)', experience: 17, bio: 'Dr. Arjun Malhotra is a skilled cardiologist specializing in non-invasive cardiac imaging and preventive cardiology.', gender: 'male', rating: 4.6, reviews: 156, featured: false, availability: { days: ['Tuesday', 'Thursday', 'Friday', 'Saturday'], slots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '03:00 PM', '03:30 PM', '04:00 PM'] }, consultation_fee: 1200 },
    { id: uuidv4(), name: 'Dr. Kavita Desai', slug: 'dr-kavita-desai', department_id: deptIds[1], department: 'Neurology', qualification: 'MBBS, MD (Neurology), DM', experience: 11, bio: 'Dr. Kavita Desai is a young and dynamic neurologist with expertise in headache disorders and movement disorders.', gender: 'female', rating: 4.5, reviews: 134, featured: false, availability: { days: ['Monday', 'Wednesday', 'Thursday', 'Saturday'], slots: ['09:00 AM', '09:30 AM', '10:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'] }, consultation_fee: 1000 },
  ];

  const blogs = [
    { id: uuidv4(), title: 'Understanding Heart Health: Tips for a Healthy Heart', slug: 'understanding-heart-health', category: 'Heart Health', author: 'Dr. Rajesh Sharma', excerpt: 'Learn about the key factors that affect your heart health and simple lifestyle changes that can make a big difference.', content: 'Heart disease remains one of the leading causes of death worldwide. However, many risk factors are within your control. Regular exercise, a balanced diet rich in fruits and vegetables, maintaining a healthy weight, and managing stress are all crucial steps toward a healthier heart.\n\nKey tips:\n1. Exercise for at least 30 minutes daily\n2. Eat a diet rich in omega-3 fatty acids\n3. Limit sodium and processed foods\n4. Monitor your blood pressure regularly\n5. Get regular cardiac check-ups after age 40', date: '2025-05-15', read_time: '5 min', featured: true },
    { id: uuidv4(), title: 'The Importance of Regular Health Check-ups', slug: 'importance-regular-checkups', category: 'Preventive Care', author: 'Dr. Deepa Nair', excerpt: 'Regular health check-ups are essential for early detection and prevention of diseases.', content: 'Preventive healthcare is the cornerstone of a long and healthy life. Regular health check-ups help detect potential health issues before they become serious.\n\nRecommended screenings by age:\n- 20s-30s: Blood pressure, cholesterol, diabetes screening\n- 40s: Add cardiac screening, cancer markers\n- 50s+: Colonoscopy, bone density, comprehensive panels', date: '2025-05-10', read_time: '4 min', featured: false },
    { id: uuidv4(), title: 'Mental Health Matters: Breaking the Stigma', slug: 'mental-health-matters', category: 'Mental Health', author: 'MedCare Wellness Team', excerpt: 'Mental health is just as important as physical health. Learn how to recognize signs and seek help.', content: 'Mental health awareness has grown significantly, yet stigma remains a barrier. Understanding that mental health conditions are medical conditions is the first step.\n\nSigns to watch for:\n- Persistent sadness or anxiety\n- Changes in sleep or appetite\n- Withdrawal from social activities\n- Difficulty concentrating', date: '2025-04-28', read_time: '6 min', featured: true },
    { id: uuidv4(), title: 'Nutrition Guide: Eating Right for Better Health', slug: 'nutrition-guide', category: 'Nutrition', author: 'MedCare Nutrition Department', excerpt: 'A balanced diet is the foundation of good health. Discover practical nutrition tips.', content: 'Good nutrition is one of the most important factors in maintaining overall health.\n\nEssential tips:\n1. Fill half your plate with fruits and vegetables\n2. Choose whole grains over refined grains\n3. Include lean proteins in every meal\n4. Stay hydrated with at least 8 glasses of water daily\n5. Limit sugar and processed food intake', date: '2025-04-20', read_time: '5 min', featured: false },
    { id: uuidv4(), title: 'Managing Diabetes: A Comprehensive Guide', slug: 'managing-diabetes', category: 'Diabetes', author: 'Dr. Deepa Nair', excerpt: 'Diabetes management requires a holistic approach including medications, lifestyle changes, and monitoring.', content: 'Diabetes is a chronic condition that affects millions worldwide. With proper management, people with diabetes can lead healthy, active lives.\n\nKey aspects:\n1. Regular blood sugar monitoring\n2. Medication adherence\n3. Regular physical activity\n4. Healthy eating habits\n5. Regular check-ups with your healthcare provider', date: '2025-04-15', read_time: '7 min', featured: false },
  ];

  const adminUser = {
    id: uuidv4(),
    name: 'Admin',
    email: 'admin@medcare.com',
    password: hashPw('admin123'),
    role: 'admin',
    phone: '+91 9876543210',
  };

  return { departments, doctors, blogs, adminUser };
}

// ============== API HANDLERS ==============

async function seedDatabase() {
  try {
    // Check if tables exist
    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      // Try auto-creation
      await tryCreateTables();
      // Check again
      const exists = await checkTablesExist();
      if (!exists) {
        return json({
          needsSetup: true,
          sql: CREATE_TABLES_SQL,
          message: 'Tables not found. Please run the provided SQL in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor).'
        });
      }
    }

    // Check if already seeded
    const { data: depts } = await supabase.from('departments').select('id').limit(1);
    if (depts && depts.length > 0) {
      return json({ message: 'Database already seeded', seeded: false });
    }

    // Insert seed data
    const seed = buildSeedData();

    const { error: e1 } = await supabase.from('departments').insert(seed.departments);
    if (e1) throw new Error(`Departments: ${e1.message}`);

    const { error: e2 } = await supabase.from('doctors').insert(seed.doctors);
    if (e2) throw new Error(`Doctors: ${e2.message}`);

    const { error: e3 } = await supabase.from('blogs').insert(seed.blogs);
    if (e3) throw new Error(`Blogs: ${e3.message}`);

    // Check if admin exists
    const { data: existingAdmin } = await supabase.from('users').select('id').eq('email', 'admin@medcare.com').limit(1);
    if (!existingAdmin || existingAdmin.length === 0) {
      const { error: e4 } = await supabase.from('users').insert([seed.adminUser]);
      if (e4) throw new Error(`Admin user: ${e4.message}`);
    }

    return json({ message: 'Database seeded successfully', seeded: true });
  } catch (e) {
    console.error('Seed error:', e);
    return json({ error: 'Failed to seed database', details: e.message }, 500);
  }
}

async function getDepartments() {
  try {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) throw error;
    return json({ departments: toCamel(data) });
  } catch (e) {
    return json({ error: 'Failed to fetch departments', details: e.message }, 500);
  }
}

async function getDoctors(request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const featured = searchParams.get('featured');

    let query = supabase.from('doctors').select('*');
    if (department && department !== 'all') query = query.eq('department', department);
    if (featured === 'true') query = query.eq('featured', true);

    const { data, error } = await query;
    if (error) throw error;
    return json({ doctors: toCamel(data) });
  } catch (e) {
    return json({ error: 'Failed to fetch doctors', details: e.message }, 500);
  }
}

async function getDoctor(id) {
  try {
    const { data, error } = await supabase.from('doctors').select('*').eq('id', id).single();
    if (error) throw error;
    return json({ doctor: toCamel(data) });
  } catch (e) {
    return json({ error: 'Doctor not found' }, 404);
  }
}

async function createAppointment(request) {
  try {
    const body = await request.json();
    const { patientName, phone, email, departmentId, doctorId, doctorName, department, date, timeSlot, notes } = body;

    if (!patientName || !phone || !email || !doctorId || !date || !timeSlot) {
      return json({ error: 'Missing required fields: patientName, phone, email, doctorId, date, timeSlot' }, 400);
    }

    // Check for existing booking
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .neq('status', 'cancelled')
      .limit(1);

    if (existing && existing.length > 0) {
      return json({ error: 'This time slot is already booked. Please choose another slot.' }, 409);
    }

    const appointment = {
      id: uuidv4(),
      patient_name: patientName,
      phone,
      email,
      department_id: departmentId || '',
      doctor_id: doctorId,
      doctor_name: doctorName || '',
      department: department || '',
      date,
      time_slot: timeSlot,
      notes: notes || '',
      status: 'confirmed',
    };

    const { error } = await supabase.from('appointments').insert([appointment]);
    if (error) throw error;

    return json({ message: 'Appointment booked successfully', appointment: toCamel(appointment) }, 201);
  } catch (e) {
    console.error('Appointment error:', e);
    return json({ error: 'Failed to book appointment', details: e.message }, 500);
  }
}

async function getAppointments(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const email = searchParams.get('email');

    let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    if (doctorId) query = query.eq('doctor_id', doctorId);
    if (email) query = query.eq('email', email);

    const { data, error } = await query;
    if (error) throw error;
    return json({ appointments: toCamel(data) });
  } catch (e) {
    return json({ error: 'Failed to fetch appointments' }, 500);
  }
}

async function updateAppointment(id, request) {
  try {
    const body = await request.json();
    const { status } = body;
    if (!status) return json({ error: 'Status is required' }, 400);

    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) throw error;
    return json({ message: 'Appointment updated successfully' });
  } catch (e) {
    return json({ error: 'Failed to update appointment' }, 500);
  }
}

async function deleteAppointment(id) {
  try {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    return json({ message: 'Appointment deleted successfully' });
  } catch (e) {
    return json({ error: 'Failed to delete appointment' }, 500);
  }
}

async function getBookedSlots(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    if (!doctorId || !date) return json({ error: 'doctorId and date required' }, 400);

    const { data, error } = await supabase
      .from('appointments')
      .select('time_slot')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .neq('status', 'cancelled');

    if (error) throw error;
    const bookedSlots = (data || []).map(a => a.time_slot);
    return json({ bookedSlots });
  } catch (e) {
    return json({ error: 'Failed to fetch booked slots' }, 500);
  }
}

async function submitContact(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) return json({ error: 'Name, email, and message are required' }, 400);

    const contact = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      message,
      status: 'new',
    };

    const { error } = await supabase.from('contact_queries').insert([contact]);
    if (error) throw error;
    return json({ message: 'Your message has been sent successfully. We will get back to you shortly.' }, 201);
  } catch (e) {
    return json({ error: 'Failed to submit contact form' }, 500);
  }
}

async function getContactQueries() {
  try {
    const { data, error } = await supabase.from('contact_queries').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return json({ queries: toCamel(data) });
  } catch (e) {
    return json({ error: 'Failed to fetch queries' }, 500);
  }
}

async function deleteContact(id) {
  try {
    const { error } = await supabase.from('contact_queries').delete().eq('id', id);
    if (error) throw error;
    return json({ message: 'Contact query deleted successfully' });
  } catch (e) {
    return json({ error: 'Failed to delete contact query' }, 500);
  }
}

async function registerUser(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;
    if (!name || !email || !password) return json({ error: 'Name, email, and password are required' }, 400);

    const { data: existing } = await supabase.from('users').select('id').eq('email', email).limit(1);
    if (existing && existing.length > 0) return json({ error: 'An account with this email already exists' }, 409);

    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashPw(password),
      phone: phone || '',
      role: 'patient',
    };

    const { error } = await supabase.from('users').insert([user]);
    if (error) throw error;

    const token = makeToken(user);
    return json({ message: 'Registration successful', user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }, 201);
  } catch (e) {
    return json({ error: 'Registration failed', details: e.message }, 500);
  }
}

async function loginUser(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) return json({ error: 'Email and password are required' }, 400);

    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !data) return json({ error: 'Invalid email or password' }, 401);
    if (data.password !== hashPw(password)) return json({ error: 'Invalid email or password' }, 401);

    const token = makeToken(data);
    return json({ message: 'Login successful', user: { id: data.id, name: data.name, email: data.email, role: data.role }, token });
  } catch (e) {
    return json({ error: 'Login failed' }, 500);
  }
}

async function getBlogs() {
  try {
    const { data, error } = await supabase.from('blogs').select('*').order('date', { ascending: false });
    if (error) throw error;
    return json({ blogs: toCamel(data) });
  } catch (e) {
    return json({ error: 'Failed to fetch blogs' }, 500);
  }
}

async function getBlog(id) {
  try {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
    if (error) throw error;
    return json({ blog: toCamel(data) });
  } catch (e) {
    return json({ error: 'Blog not found' }, 404);
  }
}

async function getAdminStats() {
  try {
    const { count: totalAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
    const { count: confirmedAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'confirmed');
    const { count: completedAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed');
    const { count: cancelledAppointments } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'cancelled');
    const { count: totalDoctors } = await supabase.from('doctors').select('*', { count: 'exact', head: true });
    const { count: totalPatients } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'patient');
    const { count: totalContacts } = await supabase.from('contact_queries').select('*', { count: 'exact', head: true });
    const { count: newContacts } = await supabase.from('contact_queries').select('*', { count: 'exact', head: true }).eq('status', 'new');

    const { data: recentAppointments } = await supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(10);
    const { data: recentContacts } = await supabase.from('contact_queries').select('*').order('created_at', { ascending: false }).limit(5);

    return json({
      stats: {
        totalAppointments: totalAppointments || 0,
        confirmedAppointments: confirmedAppointments || 0,
        completedAppointments: completedAppointments || 0,
        cancelledAppointments: cancelledAppointments || 0,
        totalDoctors: totalDoctors || 0,
        totalPatients: totalPatients || 0,
        totalContacts: totalContacts || 0,
        newContacts: newContacts || 0,
      },
      recentAppointments: toCamel(recentAppointments || []),
      recentContacts: toCamel(recentContacts || []),
    });
  } catch (e) {
    return json({ error: 'Failed to fetch admin stats', details: e.message }, 500);
  }
}

// ============== ROUTE HANDLERS ==============
export async function GET(request, { params }) {
  const pathArr = params?.path || [];
  const route = pathArr.join('/');

  if (route === 'health') return json({ status: 'ok', timestamp: new Date().toISOString() });
  if (route === 'seed') return seedDatabase();
  if (route === 'departments') return getDepartments();
  if (route === 'doctors') return getDoctors(request);
  if (route.match(/^doctors\/[^/]+$/)) return getDoctor(pathArr[1]);
  if (route === 'appointments') return getAppointments(request);
  if (route === 'booked-slots') return getBookedSlots(request);
  if (route === 'blogs') return getBlogs();
  if (route.match(/^blogs\/[^/]+$/)) return getBlog(pathArr[1]);
  if (route === 'admin/stats') return getAdminStats();
  if (route === 'admin/contacts') return getContactQueries();
  if (route === 'setup-sql') return json({ sql: CREATE_TABLES_SQL });

  return json({ error: 'Not found', route }, 404);
}

export async function POST(request, { params }) {
  const pathArr = params?.path || [];
  const route = pathArr.join('/');

  if (route === 'appointments') return createAppointment(request);
  if (route === 'contact') return submitContact(request);
  if (route === 'auth/register') return registerUser(request);
  if (route === 'auth/login') return loginUser(request);

  return json({ error: 'Not found' }, 404);
}

export async function PUT(request, { params }) {
  const pathArr = params?.path || [];
  const route = pathArr.join('/');

  if (route.match(/^appointments\/[^/]+$/)) return updateAppointment(pathArr[1], request);

  return json({ error: 'Not found' }, 404);
}

export async function DELETE(request, { params }) {
  const pathArr = params?.path || [];
  const route = pathArr.join('/');

  if (route.match(/^appointments\/[^/]+$/)) return deleteAppointment(pathArr[1]);
  if (route.match(/^contact\/[^/]+$/)) return deleteContact(pathArr[1]);

  return json({ error: 'Not found' }, 404);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
