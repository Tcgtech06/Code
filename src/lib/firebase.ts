import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAe3_ft31fy9_JjboO-Zl-evJEPmX8DR8s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tcg-tech-5753b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tcg-tech-5753b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tcg-tech-5753b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "862354181442",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:862354181442:web:50185f353cf30623004cdb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MBXJLGHJ0R"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Auth Helpers
export async function loginAdminWithEmail(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: error instanceof Error ? error : new Error('Invalid credentials') };
  }
}

export async function logoutAdmin(): Promise<{ error: Error | null }> {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: error instanceof Error ? error : new Error('Logout failed') };
  }
}

export function onAuthStatusChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Analytics
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// ----------------------------------------------------
// Database Interfaces
// ----------------------------------------------------
export interface JobPosting {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  position_id?: string;
  created_at?: string;
  positions?: {
    title: string;
  };
}

export interface Position {
  id: string;
  title: string;
  created_at?: string;
}

export interface Enquiry {
  id?: string;
  name: string;
  email: string;
  contact_number: string;
  service: string;
  message?: string;
  created_at?: string;
}

export interface JobApplicationData {
  id?: string;
  first_name: string;
  last_name?: string | null;
  email: string;
  contact: string;
  graduation_year: number;
  gender: string;
  position: string;
  experience: string;
  current_employer?: string | null;
  current_salary?: string | null;
  expected_salary?: string | null;
  skills: string;
  location: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  resume_url?: string | null;
  created_at?: string;
}

// ----------------------------------------------------
// Job Postings Functions
// ----------------------------------------------------
export async function fetchJobPostings(): Promise<{ data: JobPosting[] | null; error: Error | null }> {
  try {
    const q = query(collection(db, 'job_postings'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const jobs: JobPosting[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || '',
        location: data.location || '',
        type: data.type || '',
        description: data.description || '',
        position_id: data.position_id || '',
        created_at: data.created_at ? (data.created_at.toDate ? data.created_at.toDate().toISOString() : data.created_at) : new Date().toISOString(),
        positions: data.positions || (data.position_title ? { title: data.position_title } : undefined)
      };
    });
    return { data: jobs, error: null };
  } catch (error) {
    console.error('Error fetching jobs from Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to fetch job postings') };
  }
}

export async function createJobPosting(job: {
  title: string;
  location: string;
  type: string;
  description: string;
  position_id?: string;
  position_title?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, 'job_postings'), {
      ...job,
      created_at: serverTimestamp()
    });
    return { data: { id: docRef.id, ...job }, error: null };
  } catch (error) {
    console.error('Error creating job posting in Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to create job posting') };
  }
}

export async function deleteJobPosting(id: string) {
  try {
    await deleteDoc(doc(db, 'job_postings', id));
    return { error: null };
  } catch (error) {
    console.error('Error deleting job posting in Firebase:', error);
    return { error: error instanceof Error ? error : new Error('Failed to delete job posting') };
  }
}

// ----------------------------------------------------
// Positions Functions
// ----------------------------------------------------
export async function fetchPositions(): Promise<{ data: Position[] | null; error: Error | null }> {
  try {
    const q = query(collection(db, 'positions'), orderBy('title', 'asc'));
    const snapshot = await getDocs(q);
    const positions: Position[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || '',
        created_at: data.created_at ? (data.created_at.toDate ? data.created_at.toDate().toISOString() : data.created_at) : undefined
      };
    });
    return { data: positions, error: null };
  } catch (error) {
    console.error('Error fetching positions from Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to fetch positions') };
  }
}

export async function createPosition(title: string) {
  try {
    const docRef = await addDoc(collection(db, 'positions'), {
      title,
      created_at: serverTimestamp()
    });
    return { data: { id: docRef.id, title }, error: null };
  } catch (error) {
    console.error('Error creating position in Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to create position') };
  }
}

export async function deletePosition(id: string) {
  try {
    await deleteDoc(doc(db, 'positions', id));
    return { error: null };
  } catch (error) {
    console.error('Error deleting position in Firebase:', error);
    return { error: error instanceof Error ? error : new Error('Failed to delete position') };
  }
}

// ----------------------------------------------------
// Enquiries Function
// ----------------------------------------------------
export async function saveEnquiry(enquiry: Enquiry) {
  try {
    const docRef = await addDoc(collection(db, 'enquiries'), {
      ...enquiry,
      created_at: serverTimestamp()
    });
    return { data: { id: docRef.id, ...enquiry }, error: null };
  } catch (error) {
    console.error('Error saving enquiry to Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to save enquiry') };
  }
}

// ----------------------------------------------------
// Job Applications & Storage
// ----------------------------------------------------
export async function fetchJobApplications(): Promise<{ data: JobApplicationData[] | null; error: Error | null }> {
  try {
    const q = query(collection(db, 'job_applications'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const applications: JobApplicationData[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        first_name: data.first_name || '',
        last_name: data.last_name || null,
        email: data.email || '',
        contact: data.contact || '',
        graduation_year: Number(data.graduation_year) || 0,
        gender: data.gender || '',
        position: data.position || '',
        experience: data.experience || '',
        current_employer: data.current_employer || null,
        current_salary: data.current_salary || null,
        expected_salary: data.expected_salary || null,
        skills: data.skills || '',
        location: data.location || '',
        status: data.status || 'pending',
        resume_url: data.resume_url || null,
        created_at: data.created_at ? (data.created_at.toDate ? data.created_at.toDate().toISOString() : data.created_at) : new Date().toISOString()
      };
    });
    return { data: applications, error: null };
  } catch (error) {
    console.error('Error fetching job applications from Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to fetch job applications') };
  }
}

export async function saveJobApplication(application: JobApplicationData) {
  try {
    const docRef = await addDoc(collection(db, 'job_applications'), {
      ...application,
      created_at: serverTimestamp()
    });
    return { data: { id: docRef.id, ...application }, error: null };
  } catch (error) {
    console.error('Error saving job application to Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to save application') };
  }
}

export async function updateJobApplication(id: string, updates: Partial<JobApplicationData>) {
  try {
    const appRef = doc(db, 'job_applications', id);
    await updateDoc(appRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    console.error('Error updating job application in Firebase:', error);
    return { error: error instanceof Error ? error : new Error('Failed to update application') };
  }
}

export async function deleteJobApplication(id: string, resumeUrl?: string | null) {
  try {
    if (resumeUrl) {
      try {
        const fileRef = ref(storage, resumeUrl);
        await deleteObject(fileRef);
      } catch (storageErr) {
        console.warn('Could not delete resume from Firebase Storage:', storageErr);
      }
    }
    await deleteDoc(doc(db, 'job_applications', id));
    return { error: null };
  } catch (error) {
    console.error('Error deleting job application in Firebase:', error);
    return { error: error instanceof Error ? error : new Error('Failed to delete application') };
  }
}

export async function uploadResumeFile(file: File, applicationId: string): Promise<string | null> {
  const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'tcg_resumes';

  if (cloudinaryCloudName) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryPreset);
      formData.append('folder', 'tcg_resumes');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      }
    } catch (cldErr) {
      console.warn('Cloudinary upload failed, attempting Firebase Storage fallback:', cldErr);
    }
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `resumes/${applicationId}_${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading resume:', error);
    return null;
  }
}

// ----------------------------------------------------
// Invoices Functions
// ----------------------------------------------------
export async function getNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const counterRef = doc(db, 'invoice_counters', `year_${currentYear}`);

  try {
    const nextNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let count = 1;
      if (counterDoc.exists()) {
        count = (counterDoc.data().last_number || 0) + 1;
      }
      transaction.set(counterRef, {
        year: currentYear,
        last_number: count,
        updated_at: serverTimestamp()
      }, { merge: true });

      return count;
    });

    const paddedNumber = String(nextNumber).padStart(4, '0');
    return `TCG-${currentYear}-${paddedNumber}`;
  } catch (error) {
    console.warn('Fallback to timestamp invoice number:', error);
    return `TCG-${currentYear}-${String(Date.now()).slice(-4)}`;
  }
}

export async function saveInvoiceToFirestore(invoiceData: Record<string, unknown>) {
  try {
    const docRef = await addDoc(collection(db, 'invoices'), {
      ...invoiceData,
      created_at: serverTimestamp()
    });
    return { data: { id: docRef.id, ...invoiceData }, error: null };
  } catch (error) {
    console.error('Error saving invoice to Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to save invoice') };
  }
}

export async function fetchInvoicesFromFirestore(): Promise<{ data: Record<string, unknown>[] | null; error: Error | null }> {
  try {
    const q = query(collection(db, 'invoices'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const invoices = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        created_at: data.created_at ? (data.created_at.toDate ? data.created_at.toDate().toISOString() : data.created_at) : new Date().toISOString()
      };
    });
    return { data: invoices, error: null };
  } catch (error) {
    console.error('Error fetching invoices from Firebase:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Failed to fetch invoices') };
  }
}

export async function deleteInvoiceFromFirestore(id: string) {
  try {
    await deleteDoc(doc(db, 'invoices', id));
    return { error: null };
  } catch (error) {
    console.error('Error deleting invoice from Firebase:', error);
    return { error: error instanceof Error ? error : new Error('Failed to delete invoice') };
  }
}
